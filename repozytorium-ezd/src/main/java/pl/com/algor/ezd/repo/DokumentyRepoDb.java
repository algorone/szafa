/*
 * Copyright (C) 2026 Algor Informatyzcja Przedsiębiorstw Sp. z o.o.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://gnu.org>.
 */
package pl.com.algor.ezd.repo;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.sql.Connection;
import java.sql.JDBCType;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.j256.simplemagic.ContentInfoUtil;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
/**
 * Repozytorium oparete o bazę danych
 */

@Singleton
public class DokumentyRepoDb {

    @Inject
    DataSource dataSource;

    @Inject
    ObjectMapper objectMapper;

    ContentInfoUtil contentUtil = new ContentInfoUtil();

    public InputStream getDane(String guid, int uid){
        try(Connection con = dataSource.getConnection(); var ps = con.prepareStatement("SELECT dane, proxy, mime FROM ezd.dokumenty WHERE guid = ? AND (ARRAY[uid,gid] || inne)::integer[] && ids(?)")){
            ps.setString(1, guid);
            ps.setInt(2, uid);
            var rs = ps.executeQuery();
            if (rs.next()) {
                var proxyUrl = rs.getString(2);
                if(proxyUrl != null && !proxyUrl.isEmpty())
                    return getHttp11Stream(proxyUrl);
                else 
                    return new ByteArrayInputStream(rs.getBytes(1));
            }
            throw new RuntimeException("Brak danych lub dostepu do danych");

        } catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    public InputStream getHttp11Stream(String proxyUrl) throws IOException {
        URL url = URI.create(proxyUrl).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        
        connection.setConnectTimeout(1000); 
        connection.setReadTimeout(5000);  

        connection.setRequestMethod("GET");
        connection.setUseCaches(false);    
        connection.setInstanceFollowRedirects(true); 

        connection.setRequestProperty("Connection", "keep-alive"); 

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {

            return connection.getInputStream();
        } else {
            InputStream errorStream = connection.getErrorStream();
            if (errorStream != null) {
                errorStream.close();
            }
            throw new IOException("Serwer HTTP/1.1 odpowiedział błędem: " + responseCode);
        }
    }

    public SuccessInfo insert(String guid, byte[] dane, int uid){
        String mime = "application/octet-stream";
        try{
            var info = contentUtil.findMatch(dane);
            mime = info.getMimeType();
        }catch(Exception e){
            System.err.print(e);
        }
        try (Connection con = dataSource.getConnection();
        var ps = con.prepareStatement("INSERT INTO ezd.dokumenty(guid, dane,uid, mime) VALUES(?, ?, ?, ?)")) {
            ps.setString(1, guid);
            ps.setBytes(2, dane);
            ps.setInt(3, uid);
            ps.setString(4, mime);
            ps.execute();
        } catch (Exception e) {
            throw new RuntimeException("Nie udało sie doddać dokumentu", e);
        }
        return new SuccessInfo("DODAJ_DOKUMENT","Dodano dokument do repozytorium");
    }

    public SuccessInfo insertProxy(String guid, ProxyInfo proxyInfo, int uid){
        try (Connection con = dataSource.getConnection();
        var ps = con.prepareStatement("INSERT INTO ezd.dokumenty(guid, proxy,uid, mime) VALUES(?, ?, ?, ?)")) {
            ps.setString(1, guid);
            ps.setString(2, proxyInfo.proxy);
            ps.setInt(3, uid);
            ps.setString(4, proxyInfo.mime);
            ps.execute();
        } catch (Exception e) {
            throw new RuntimeException("Nie udało sie doddać dokumentu", e);
        }
        return new SuccessInfo("DODAJ_DOKUMENT","Dodano dokument do repozytorium");
    }

    static String INSERT_POPRZEDNIE="""
INSERT INTO ezd.poprzednie(guid, dane, proxy,  wersja)
SELECT d.guid, d.dane, d.proxy,  
    COALESCE ( (SELECT MAX(p.wersja) FROM ezd.poprzednie p WHERE p.guid= d.guid), 0 ) + 1 wersja 
FROM ezd.dokumenty d
WHERE d.guid = ? AND d.uid = ? 
""";

    public SuccessInfo updateWersja(String guid, byte[] dane, int uid){
         
        var sqlUpate = "UPDATE ezd.dokumenty SET dane = ? WHERE guid = ? AND uid = ?";

        try (Connection con = dataSource.getConnection();
            var insertPoprzednie = con.prepareStatement(INSERT_POPRZEDNIE);
            var updateSklad = con.prepareStatement(sqlUpate)
        ) {
            insertPoprzednie.setString(1, guid);
            insertPoprzednie.setInt(2, uid);
            var resp = insertPoprzednie.executeUpdate();
            updateSklad.setBytes(1, dane);
            updateSklad.setString(2, guid);
            updateSklad.setInt(3, uid);
            resp = updateSklad.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie można aktualizaowac dokumentu, bark dokumentu lub uprawnień");

        } catch(Exception e){
            throw new RuntimeException("Aktualizcja nie udała się ", e);
        }
        return new SuccessInfo("AKTUALIZUJ_DOKUMENT","Zaktualizowno dokument w repozytorium");
    }
    
    public SuccessInfo updateWersjaProxy(String guid, ProxyInfo proxyInfo, int uid){
        
        var sqlUpate = "UPDATE ezd.dokumenty SET proxy = ?, mime = ? WHERE guid = ? AND uid = ?";
        try (Connection con = dataSource.getConnection();
            var insertPoprzednie = con.prepareStatement(INSERT_POPRZEDNIE);
            var updateSklad = con.prepareStatement(sqlUpate)
        ) {
            insertPoprzednie.setString(1, guid);
            insertPoprzednie.setInt(2, uid);
            var resp = insertPoprzednie.executeUpdate();
            updateSklad.setString(1, proxyInfo.proxy);
            updateSklad.setString(2, proxyInfo.mime);
            updateSklad.setString(3, guid);
            updateSklad.setInt(4, uid);
            resp = updateSklad.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie można aktualizaowac dokumentu, bark dokumentu lub uprawnień");

        } catch(Exception e){
            throw new RuntimeException("Aktualizcja nie udała się ", e);
        }
        return new SuccessInfo("AKTUALIZUJ_DOKUMENT","Zaktualizowno dokument w repozytorium");
    }

    public SuccessInfo delete(String guid, int uid){
        try (Connection con = dataSource.getConnection();
         var ps = con.prepareStatement("DELETE FROM ezd.dokumenty WHERE guid = ? AND uid = ?");
         var deletePoprzednie = con.prepareStatement("DELETE FROM ezd.poprzednie WHERE guid = ? ")
        ) { 
            con.setAutoCommit(false);        
            ps.setString(1, guid);
            ps.setInt(2, uid);
            var resp = ps.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie można usunąć dokumentu, bark dokumentu lub uprawnień");
            deletePoprzednie.setString(1, guid);
            deletePoprzednie.executeUpdate();
            con.commit();

        } catch (Exception e) {
            throw new RuntimeException("Nie udało sie usunąć dokumentu", e);
        }
        return new SuccessInfo("USUN_DOKUMENT","Usunieto dokument z repozytorium");
    }

    public DokumentInfo info(String guid, int uid){
        var sql ="""
SELECT guid, length(dane) rozmiar, mime, 
	uid, gid, inne, 
	to_char(utworzono, 'YYYY-MM-DDThh:mm:ss') data_utworzeni,
	to_char(aktualizacja, 'YYYY-MM-DDThh:mm:ss') data_aktualizacji,
    aranzacja
FROM ezd.dokumenty 
WHERE guid =? AND (ARRAY[uid,gid] || inne)::integer[] && ids(?)
                """;
        DokumentInfo ret = new DokumentInfo();
        try (Connection con = dataSource.getConnection();
         var selectInfo = con.prepareStatement(sql)  ) { 
            selectInfo.setString(1, guid);
            selectInfo.setInt(2, uid);
            var rs = selectInfo.executeQuery();
            if (rs.next()){
                ret.guid = guid;
                ret.rozmiar= rs.getInt(2);
                ret.mime = rs.getString(3);
                ret.uid = rs.getInt(4);
                ret.gid = rs.getInt(5);
                if (rs.getObject(6)!= null){
        
                    var inneStr = rs.getObject(6).toString();
                    inneStr = inneStr.replace("{","").replace("}","");
                    String[] inneStrArray = inneStr.split(",");
                    int[] inne = new int[inneStrArray.length];
                    for(int i = 0 ; i < inneStrArray.length; i++) {
                        inne[i]= Integer.parseInt(inneStrArray[i]);
                    }    
                    ret.inne=inne;
     
                }
                ret.dataUtworzenia = rs.getString(7);
                ret.dataAktualizacji = rs.getString(8);
                if(rs.getObject(9)!=null){
                    var arrayAranzacje = rs.getArray(9);
                    String[] aranzacja = (String[]) arrayAranzacje.getArray();
                    ret.aranzacja = aranzacja;
                    
                }
            } else {
                throw new RuntimeException("Brak danych lub dostepu do danych");
            }

        }catch (SQLException e) {
            throw new RuntimeException("Nie udało pobrac danych dokumentu", e);
        }
         return ret;
    }

    public enum MODYFIKACE_SEC {
        UID("UPDATE ezd.dokumenty SET uid = ? WHERE guid = ? AND uid = ?"),
        GID("UPDATE ezd.dokumenty SET gid = ? WHERE guid = ? AND uid = ?"),
        DODAJ_INNE("UPDATE ezd.dokumenty SET inne = array_append(inne, ?) WHERE guid = ? AND uid = ?"), 
        USUN_INNE("UPDATE ezd.dokumenty SET inne = array_remove(inne, ?) WHERE guid = ? AND uid = ?"), 
        WYCZYSC_INNE("UPDATE ezd.dokumenty SET inne = null WHERE guid = ? AND uid = ?");

        final String sql;
        private MODYFIKACE_SEC(String sql){
            this.sql = sql;
        }
    }
    
    public SuccessInfo updateSecurity(String guid, int uid, MODYFIKACE_SEC opracja, int sec_id ){
        try (Connection con = dataSource.getConnection();
            var update = con.prepareStatement(opracja.sql)
        ){
            switch (opracja) {
                case WYCZYSC_INNE:
                    update.setString(1, guid);
                    update.setInt(2, uid);
                    break;
                default:
                    update.setInt(1, sec_id);
                    update.setString(2, guid);
                    update.setInt(3, uid);
                    break;
            }
            var resp  = update.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie udało się zmienić zabezpieczeń, brak danych lub dostepu do danych");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new SuccessInfo("ZMIANA_UPWANIEN", "Zmienion uprwanienia dostepu dla dokumentu");
    }

    public List<DokumentWersja> wersje(String guid, int uid){
        var ret = new ArrayList<DokumentWersja>();
        var sql ="""
SELECT guid, wersja, utworzono 
FROM ezd.poprzednie
WHERE guid IN (
	SELECT guid FROM ezd.dokumenty 
		WHERE guid = ? AND (ARRAY[uid,gid] || inne)::integer[] && ids(?)
)       
                """;

        try (Connection con = dataSource.getConnection();
            var select = con.prepareStatement(sql)
        ){
            select.setString(1, guid);
            select.setInt(2, uid);
            var rs = select.executeQuery();
            while (rs.next()) {
                ret.add( new DokumentWersja(rs.getString(1),rs.getInt(2),rs.getString(3)));
            } 

        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
        return ret;
    }

    public byte[] poprzedni(String guid, int uid, int wersja) {
        var sql ="""
SELECT dane
FROM ezd.poprzednie
WHERE guid IN (
	SELECT guid FROM ezd.dokumenty 
		WHERE guid = ? AND (ARRAY[uid,gid] || inne)::integer[] && ids(?)
)  AND wersja = ?    
                """;
     try(Connection con = dataSource.getConnection(); 
        var ps = con.prepareStatement(sql)){
            ps.setString(1, guid);
            ps.setInt(2, uid);
            ps.setInt(3, wersja);
            var rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getBytes(1);
            }
            throw new RuntimeException("Brak danych lub dostepu do danych");

        } catch(Exception e){
            throw new RuntimeException(e);
        }

    }

    public SuccessInfo updateAranzacja(String guid, List<String> aranazacja , int uid){
        var sql = "UPDATE ezd.dokumenty SET aranzacja = ? WHERE uid = ? AND guid = ?";
        try (Connection con = dataSource.getConnection();
            var update = con.prepareStatement(sql)
        ){
            if (aranazacja !=null){
                var lista = con.createArrayOf("text", aranazacja.toArray());
                update.setArray(1, lista);
            } else {
                update.setNull(1,JDBCType.ARRAY.getVendorTypeNumber());
            }
            update.setInt(2, uid);
            update.setString(3, guid);
            var resp  = update.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie udało się zmienić zabezpieczeń, brak danych lub dostepu do danych");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new SuccessInfo("ZMIANA_UPWANIEN", "Zmienion uprwanienia dostepu dla dokumentu");
    }

}
