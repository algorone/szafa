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

import java.sql.Connection;
import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.ws.rs.NotFoundException;

/**
 * Repozytorium oparete o bazę danych.
 */

@Singleton
public class IndeksyRepoDb {

    @Inject
    DataSource dataSource;

    @Inject
    ObjectMapper objectMapper;


    public Pagina<Klucz> pobierzIndeks(String kod, int limit, int offset, String term, long uid) {
    Pagina<Klucz> pagina = new Pagina<>();
    pagina.limit = limit;
    pagina.offset = offset;
    pagina.lista = new ArrayList<>();
    pagina.count = 0;

    boolean hasTerm = term != null && !term.isBlank();

    StringBuilder sqlCount = new StringBuilder("""
        SELECT COUNT(*) AS total_count
        FROM ezd.indeksy
        WHERE kod = ? AND uid = ?
        """);
    
    if (hasTerm) {
        sqlCount.append(" AND (klucz ILIKE ? OR haslo ILIKE ?)");
    }

    StringBuilder sqlData = new StringBuilder("""
        SELECT klucz, haslo
        FROM ezd.indeksy
        WHERE kod = ? AND uid = ?
        """);
    
    if (hasTerm) {
        sqlData.append(" AND (klucz ILIKE ? OR haslo ILIKE ?)");
    }
    
    sqlData.append(" ORDER BY klucz ASC LIMIT ? OFFSET ?");

    try (Connection con = dataSource.getConnection()) {
        
        try (PreparedStatement psCount = con.prepareStatement(sqlCount.toString())) {
            int idx = 1;
            psCount.setString(idx++, kod);
            psCount.setLong(idx++, uid);
            if (hasTerm) {
                String pattern = "%" + term.trim() + "%";
                psCount.setString(idx++, pattern);
                psCount.setString(idx++, pattern);
            }
            try (ResultSet rs = psCount.executeQuery()) {
                if (rs.next()) {
                    pagina.count = rs.getLong("total_count");
                }
            }
        }

        if (pagina.count == 0) {
            return pagina;
        }

        try (PreparedStatement psData = con.prepareStatement(sqlData.toString())) {
            int idx = 1;
            psData.setString(idx++, kod);
            psData.setLong(idx++, uid);
            if (hasTerm) {
                String pattern = "%" + term.trim() + "%";
                psData.setString(idx++, pattern);
                psData.setString(idx++, pattern);
            }
            psData.setInt(idx++, limit);
            psData.setInt(idx++, offset);
            
            try (ResultSet rs = psData.executeQuery()) {
                while (rs.next()) {
                    Klucz k = new Klucz();
                    k.klucz = rs.getString("klucz");
                    k.haslo = rs.getString("haslo");
                    pagina.lista.add(k);
                }
            }
        }
        
    } catch (Exception e) {
        throw new RuntimeException("Błąd podczas pobierania stronicowanego indeksu", e);
    }

    return pagina;
}


    public SuccessInfo insert(String kod, KluczDane dane, long uid) {
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(
                        "INSERT INTO ezd.indeksy(kod, klucz, haslo, sprawy, akta, negaty, uid) VALUES(?, ?, ?, ?, ?, ?, ?)")) {

            ps.setString(1, kod);
            ps.setString(2, dane.klucz);
            ps.setString(3, dane.haslo);

            ps.setArray(4, mapToSqlArray(con, dane.sprawy));
            ps.setArray(5, mapToSqlArray(con, dane.akta));
            ps.setArray(6, mapToSqlArray(con, dane.negaty));

            ps.setLong(7, uid);

            ps.execute();

        } catch (Exception e) {
            throw new RuntimeException("Nie udało się dodać klucza", e);
        }

        return new SuccessInfo("DODAJ_KLUCZ");
    }

    public String pobierzDane(String kod, String klucz, long uid) {
        String sql = """
                SELECT jsonb_build_object(
                    'klucz', klucz,
                    'haslo', haslo,
                    'sprawy', to_jsonb(sprawy),
                    'akta', to_jsonb(akta),
                    'negaty', to_jsonb(negaty)
                )::text AS json_data
                FROM ezd.indeksy
                WHERE kod = ? AND klucz = ? AND uid = ?;
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, kod);
            ps.setString(2, klucz);
            ps.setLong(3, uid);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("json_data");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas odczytu danych indeksu z repozytorium", e);
        }

        throw new NotFoundException("Nie znaleziono indeksu o podanych parametrach dla wskazanego użytkownika.");
    }

    public SuccessInfo aktualizujHaslo(String kod, String klucz, String noweHaslo, long uid) {
        String sql = "UPDATE ezd.indeksy SET haslo = ? WHERE kod = ? AND klucz = ? AND uid = ?";

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, noweHaslo);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();

            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do jego modyfikacji.");
            }

        } catch (NotFoundException e) {
            throw e; 
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas aktualizacji hasła klucza", e);
        }
        return new SuccessInfo("HASLO_UPDATED");
    }

    public SuccessInfo delete(String kod, String klucz, long uid) {
        try (Connection con = dataSource.getConnection();
                var ps = con.prepareStatement("DELETE FROM ezd.indeksy WHERE kod = ? AND klucz = ? AND uid = ?");

        ) {
            con.setAutoCommit(false);
            ps.setString(1, kod);
            ps.setString(2, klucz);
            ps.setLong(3, uid);
            var resp = ps.executeUpdate();
            if (resp == 0)
                throw new RuntimeException("Nie można usunąć akt, bark akt lub uprawnień");

        } catch (Exception e) {
            throw new RuntimeException("Nie udało sie usunąć akt", e);
        }
        return new SuccessInfo("USUN_KLUCZ");
    }

    public SuccessInfo wstawSprawyPodKlucz(String kod, String klucz, List<String> sprawy, long uid) {
        String sql = "UPDATE ezd.indeksy SET sprawy = ? WHERE kod = ? AND klucz = ? AND uid = ?";

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            Array sqlSprawy = mapToSqlArray(con, sprawy);

            ps.setArray(1, sqlSprawy);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do jego modyfikacji.");
            }

            return new SuccessInfo("UPDATED_SPRAWY");

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas nadpisywania listy spraw", e);
        }
    }

    public SuccessInfo dodajPozycjeSprawy(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET sprawy = array_append(coalesce(sprawy, '{}'::text[]), ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do dodania sprawy.");
            }

            return new SuccessInfo("ADDED_SPRAWA");

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas dodawania pozycji sprawy pod klucz", e);
        }
    }

    public SuccessInfo usunPozycjeSprawy(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET sprawy = array_remove(sprawy, ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do usunięcia sprawy.");
            }

            return new SuccessInfo("REMOVED_SPRAWA");

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas usuwania pozycji sprawy spod klucza", e);
        }
    }

    public SuccessInfo wstawAktaPodKlucz(String kod, String klucz, List<String> akta, long uid) {
        String sql = "UPDATE ezd.indeksy SET akta = ? WHERE kod = ? AND klucz = ? AND uid = ?";

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            Array sqlakta = mapToSqlArray(con, akta);

            ps.setArray(1, sqlakta);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do jego modyfikacji.");
            }
            return new SuccessInfo("UPDATED_AKTA");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas nadpisywania listy akt", e);
        }
    }

    public SuccessInfo dodajPozycjeAkt(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET akta = array_append(coalesce(akta, '{}'::text[]), ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException(
                        "Nie znaleziono wskazanego klucza lub brak uprawnień do dodania akt.");
            }
            return new SuccessInfo("ADDED_AKTA");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas dodawania pozycji akt pod klucz", e);
        }
    }

    public SuccessInfo usunPozycjeAkt(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET akta = array_remove(akta, ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException(
                        "Nie znaleziono wskazanego klucza lub brak uprawnień do usunięcia akt.");
            }
            return new SuccessInfo("REMOVED_AKTA");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas usuwania pozycji akt spod klucza", e);
        }
    }

    public SuccessInfo wstawNegatyPodKlucz(String kod, String klucz, List<String> negaty, long uid) {
        String sql = "UPDATE ezd.indeksy SET negaty = ? WHERE kod = ? AND klucz = ? AND uid = ?";

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            Array sqlNegaty = mapToSqlArray(con, negaty);

            ps.setArray(1, sqlNegaty);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do jego modyfikacji.");
            }
            return new SuccessInfo("UPDATED_NEGATY");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas nadpisywania listy negatów", e);
        }
    }

    public SuccessInfo dodajPozycjeNegatu(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET negaty = array_append(coalesce(negaty, '{}'::text[]), ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do dodania negatu.");
            }
            return new SuccessInfo("ADDED_NEGAT");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas dodawania pozycji negatu pod klucz", e);
        }
    }

    public SuccessInfo usunPozycjeNegatu(String kod, String klucz, String znak, long uid) {
        String sql = """
                UPDATE ezd.indeksy
                SET negaty = array_remove(negaty, ?)
                WHERE kod = ? AND klucz = ? AND uid = ?
                """;

        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, znak);
            ps.setString(2, kod);
            ps.setString(3, klucz);
            ps.setLong(4, uid);

            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated == 0) {
                throw new NotFoundException("Nie znaleziono wskazanego klucza lub brak uprawnień do usunięcia negatu.");
            }
            return new SuccessInfo("REMOVED_NEGAT");
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas usuwania pozycji negatu spod klucza", e);
        }
    }

    public enum MODYFIKACE_SEC {
        UID("UPDATE ezd.indeksy SET uid = ? WHERE kod = ? AND klucz = ? AND uid = ?"),
        GID("UPDATE ezd.indeksy SET gid = ? WHERE kod = ? AND klucz = ? AND uid = ?"),
        DODAJ_INNE("UPDATE ezd.indeksy SET inne = array_append(inne, ?) WHERE kod = ? AND klucz = ? AND uid = ?"),
        USUN_INNE("UPDATE ezd.indeksy SET inne = array_remove(inne, ?) WHERE kod = ? AND klucz = ? AND uid = ?"),
        WYCZYSC_INNE("UPDATE ezd.indeksy SET inne = null WHERE kod = ? AND klucz = ? AND uid = ?");

        final String sql;

        private MODYFIKACE_SEC(String sql) {
            this.sql = sql;
        }
    }

    public SuccessInfo updateSecurity(String kod, String klucz, long uid, MODYFIKACE_SEC operacja, long sec_id) {
        try (Connection con = dataSource.getConnection();
                PreparedStatement update = con.prepareStatement(operacja.sql)) {

            switch (operacja) {
                case WYCZYSC_INNE:
                    update.setString(1, kod);
                    update.setString(2, klucz);
                    update.setLong(3, uid);
                    break;
                default:
                    update.setLong(1, sec_id);
                    update.setString(2, kod);
                    update.setString(3, klucz);
                    update.setLong(4, uid);
                    break;
            }

            int resp = update.executeUpdate();
            if (resp == 0) {
                throw new NotFoundException("Nie udało się zmienić zabezpieczeń. Brak danych lub brak dostępu.");
            }

        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas aktualizacji uprawnień w bazie danych", e);
        }
        return new SuccessInfo("ZMIANA_UPRAWNIEN");
    }

    public String pobierzInfoTechniczneJakJson(String kod, String klucz, long uid) {

        String sql = """
        SELECT jsonb_build_object(
            'uid', uid,
            'gid', gid,
            'inne', to_jsonb(inne),
            'techniczny_id', (kod || '_' || klucz), 
            'data_utworzenia', to_char(data_utworzenia, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
            'data_aktualizacji', to_char(data_aktualizacji, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
            'uwagi', CAST(NULL AS text)
        )::text AS tech_info
        FROM ezd.indeksy
        WHERE kod = ? AND klucz = ? AND uid = ?;
        """;

    try (Connection con = dataSource.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        
        ps.setString(1, kod);
        ps.setString(2, klucz);
        ps.setLong(3, uid);
        
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                String jsonResult = rs.getString("tech_info");
                
                if (jsonResult == null) {
                    throw new NotFoundException("Nie znaleziono indeksu o podanych parametrach.");
                }
                
                return jsonResult;
            }
        }
    } catch (NotFoundException e) {
        throw e;
    } catch (Exception e) {
        throw new RuntimeException("Błąd podczas generowania obiektu Info z bazy danych", e);
    }
    
    throw new NotFoundException("Nie znaleziono indeksu o podanych parametrach.");
}

    private Array mapToSqlArray(Connection con, List<String> list) throws SQLException {
        if (list == null) {
            return null;
        }
        String[] javaArray = list.toArray(new String[0]);
        return con.createArrayOf("text", javaArray);
    }
}
