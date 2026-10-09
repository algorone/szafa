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

import java.util.List;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pl.com.algor.ezd.repo.DokumentyRepoDb.MODYFIKACE_SEC;
import javax.sql.DataSource;



@Path("dokumenty/{guid}")
public class DokumentyApi {


    @Inject
    DataSource dataSource;

    @Inject
    DokumentyRepoDb repo;

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response  getDokument(String guid) {
        int uid = getUid();
        var is = repo.getDane(guid, uid);
        return Response.ok(is)
                    // .header("Content-Type", contentType)
                    // .header("Content-Length", contentLength)
                    // .header("Content-Disposition", contentDisposition)
                    .build();
        
    }

    private int getUid() {
        return -1;
    }

    @POST
    @Consumes("application/binary")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo dodajDokument(byte[] plik, String guid) throws Exception {
          System.out.println("BINARNA KUFA!!!!");
        int uid = getUid();
        return repo.insert(guid, plik, uid);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo dodajDokumenProxyt(ProxyInfo proxyInfo, String guid) throws Exception {
        System.out.println("KUFA!!!!");
        int uid = getUid();
        return repo.insertProxy(guid, proxyInfo, uid);
    }

    @PATCH
    @Consumes("application/binary")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo aktualizujDokument(byte[] plik, String guid) {
        int uid = getUid();
        return repo.updateWersja(guid, plik, uid);
    }

    @PATCH
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo aktualizujProxt(ProxyInfo proxyInfo, String guid) {
        int uid = getUid();
        return repo.updateWersjaProxy(guid, proxyInfo, uid);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo usunDokument(String guid) {
        int uid = getUid();
        return repo.delete(guid, uid);
    }

    @GET
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON)
    public DokumentInfo getInfo(String guid){
        int uid = getUid();
        return repo.info(guid, uid);
    }

    @POST
    @Path("/uid/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo zmienUid(String guid, int id){
        int uid = getUid();
        return repo.updateSecurity(guid, uid, MODYFIKACE_SEC.UID, id);
    }

    @POST
    @Path("/gid/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo zmienGid(String guid, int id){
        int uid = getUid();
        return repo.updateSecurity(guid, uid, MODYFIKACE_SEC.GID, id);
    }

    @POST
    @Path("/inne/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo dodajInne(String guid, int id){
        int uid = getUid();
        return repo.updateSecurity(guid, uid, MODYFIKACE_SEC.DODAJ_INNE, id);
    }

    @DELETE
    @Path("/inne/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo usunInne(String guid, int id){
        int uid = getUid();
        return repo.updateSecurity(guid, uid, MODYFIKACE_SEC.USUN_INNE, id);
    }

    @DELETE
    @Path("/inne")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo wyczyscInne(String guid){
        int uid = getUid();
        return repo.updateSecurity(guid, uid, MODYFIKACE_SEC.WYCZYSC_INNE, 0);
    }

    @GET
    @Path("/poprzednie")
    public List<DokumentWersja> wersje(String guid){
        int uid = getUid();
        return repo.wersje(guid, uid);
    }

    @GET
    @Path("/poprzednie/{wersja}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public byte[] getPoprzedni(String guid, int wersja){
        int uid = getUid();
        return repo.poprzedni(guid, uid, wersja);
    }

    @POST
    @Path("/aranzacja")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo dodajAranzacje(List<String> aranzacja, String guid) throws Exception {
        int uid = getUid();
        return repo.updateAranzacja(guid, aranzacja, uid);
    }

    @DELETE
    @Path("/aranzacja")
    @Produces(MediaType.APPLICATION_JSON)
    public SuccessInfo usunAranzacje(String guid){
        int uid = getUid();
        return repo.updateAranzacja(guid, null, uid);
    }

}
