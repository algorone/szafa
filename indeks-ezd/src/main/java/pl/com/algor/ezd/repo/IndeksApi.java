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
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


// import javax.sql.DataSource;

import jakarta.ws.rs.*;

import org.eclipse.microprofile.openapi.annotations.Operation;

@Path("/indeksy/{kod}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IndeksApi {

    @Inject
    IndeksyRepoDb repo;

    @GET
    @Operation(operationId = "pobierz_indeks")
    public Response pobierzIndeks(
            @PathParam("kod") String kod,
            @QueryParam("limit") @DefaultValue("50") int limit,
            @QueryParam("offset") @DefaultValue("0") int offset,
            @QueryParam("term") String term) {

        Pagina<Klucz> pagina = repo.pobierzIndeks(kod, limit, offset, term, getUid());

        return Response.ok(pagina.lista)
                .header("x-result-count", pagina.count)
                .header("x-requested-limit", pagina.limit)
                .header("x-requested-offset", pagina.offset)
                .build();
    }

    @GET
    @Path("/{klucz}")
    @Operation(operationId = "pobierz_dane")
    public Response pobierzDane(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz) {

        String jsonResult = repo.pobierzDane(kod, klucz, getUid());
        return Response.ok(jsonResult, MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/{klucz}")
    @Operation(operationId = "dodaj_klucz")
    public SuccessInfo dodajKlucz(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            KluczDane body) {
        if (!klucz.equals(body.klucz))
            throw new RuntimeException("CROSS CHECK ERROR - klucz");
        return repo.insert(kod, body, getUid());
    }

    @PATCH
    @Path("/{klucz}")
    @Operation(operationId = "aktualizuj_haslo")
    public SuccessInfo aktualizujHaslo(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            Klucz body) {

        if (body == null || body.haslo == null || body.haslo.isBlank()) {
            throw new BadRequestException("Brak nowego hasła w żądaniu.");
        }

        if (body.klucz != null && !klucz.equals(body.klucz)) {
            throw new BadRequestException("CROSS CHECK ERROR - Klucz w ścieżce nie zgadza się z wartością w body.");
        }
        return repo.aktualizujHaslo(kod, klucz, body.haslo, getUid());

    }

    @DELETE
    @Path("/{klucz}")
    @Operation(operationId = "usun_klucz")
    public SuccessInfo usunKlucz(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz) {
        repo.delete(kod, klucz, getUid());
        return new SuccessInfo("DELETED");
    }

    @PUT
    @Path("/{klucz}/sprawy")
    @Operation(operationId = "wstaw_sprawy_pod_klucz")
    public SuccessInfo wstawSprawyPodKlucz(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            List<String> sprawy) {

        return repo.wstawSprawyPodKlucz(kod, klucz, sprawy, getUid());
    }

    @POST
    @Path("/{klucz}/sprawy/{znak}")
    @Operation(operationId = "dodaj_pozycje_sprawy")
    public SuccessInfo dodajPozycjeSprawy(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {

        return repo.dodajPozycjeSprawy(kod, klucz, znak, getUid());
    }

    @DELETE
    @Path("/{klucz}/sprawy/{znak}")
    @Operation(operationId = "usun_pozycje_sprawy")
    public SuccessInfo usunPozycjeSprawy(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {

        return repo.usunPozycjeSprawy(kod, klucz, znak, getUid());
    }

    @PUT
    @Path("/{klucz}/akta")
    @Operation(operationId = "wstaw_akta_pod_klucz")
    public SuccessInfo wstawAktaPodKlucz(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            List<String> akta) {
        return repo.wstawAktaPodKlucz(kod, klucz, akta, getUid());
    }

    @POST
    @Path("/{klucz}/akta/{znak}")
    @Operation(operationId = "dodaj_pozycje_akt")
    public SuccessInfo dodajPozycjeAkt(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {
        return repo.dodajPozycjeAkt(kod, klucz, znak, getUid());
    }

    @DELETE
    @Path("/{klucz}/akta/{znak}")
    @Operation(operationId = "usun_pozycje_akt")
    public SuccessInfo usunPozycjeAkt(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {
        return repo.usunPozycjeAkt(kod, klucz, znak, getUid());
    }

    @PUT
    @Path("/{klucz}/negaty")
    @Operation(operationId = "wstaw_negaty_pod_klucz")
    public SuccessInfo wstawNegatyPodKlucz(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            List<String> negaty) {
        return repo.wstawNegatyPodKlucz(kod, klucz, negaty, getUid());
    }

    @POST
    @Path("/{klucz}/negaty/{znak}")
    @Operation(operationId = "dodaj_pozycje_negatu")
    public SuccessInfo dodajPozycjeNegatu(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {
        return repo.dodajPozycjeNegatu(kod, klucz, znak, getUid());
    }

    @DELETE
    @Path("/{klucz}/negaty/{znak}")
    @Operation(operationId = "usun_pozycje_negatu")
    public SuccessInfo usunPozycjeNegatu(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("znak") String znak) {
        return repo.usunPozycjeNegatu(kod, klucz, znak, getUid());
    }

    @POST
    @Path("/{klucz}/uid/{uid}")
    @Operation(operationId = "set_klucz_uid")
    public SuccessInfo setKluczUid(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("uid") Long uid) {

        return repo.updateSecurity(kod, klucz, getUid(), IndeksyRepoDb.MODYFIKACE_SEC.UID, uid);
    }

    @POST
    @Path("/{klucz}/gid/{gid}")
    @Operation(operationId = "set_klucz_gid")
    public SuccessInfo setKluczGid(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("gid") Long gid) {

        return repo.updateSecurity(kod, klucz, getUid(), IndeksyRepoDb.MODYFIKACE_SEC.GID, gid);
    }

    @POST
    @Path("/{klucz}/inne/{id}")
    @Operation(operationId = "dodaj_klucz_inne")
    public SuccessInfo dodajKluczInne(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("id") Long id) {

        return repo.updateSecurity(kod, klucz, getUid(), IndeksyRepoDb.MODYFIKACE_SEC.DODAJ_INNE, id);
    }

    @DELETE
    @Path("/{klucz}/inne/{id}")
    @Operation(operationId = "usunj_klucz_inne")
    public SuccessInfo usunDokumentInne(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz,
            @PathParam("id") Long id) {

        return repo.updateSecurity(kod, klucz, getUid(), IndeksyRepoDb.MODYFIKACE_SEC.USUN_INNE, id);
    }

    @DELETE
    @Path("/{klucz}/inne")
    @Operation(operationId = "wyczysc_klucz_inne")
    public SuccessInfo wyczyscDokumentInne(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz) {
        return repo.updateSecurity(kod, klucz, getUid(), IndeksyRepoDb.MODYFIKACE_SEC.WYCZYSC_INNE, 0L);
    }

    @GET
    @Path("/{klucz}/info")
    @Operation(operationId = "techniczne_indeks")
    public Response techniczneIndeks(
            @PathParam("kod") String kod,
            @PathParam("klucz") String klucz) {
        
        String jsonResult = repo.pobierzInfoTechniczneJakJson(kod, klucz, getUid());
        return Response.ok(jsonResult, MediaType.APPLICATION_JSON).build();
    }

    private long getUid() {
        return -1;
    }
}
