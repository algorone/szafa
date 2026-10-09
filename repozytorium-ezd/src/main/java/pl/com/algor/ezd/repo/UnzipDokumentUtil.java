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

import java.util.zip.ZipInputStream;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;

/** 
 * Dodatkowy endpoint do preview
 */
@Path("preview/{guid}")
public class UnzipDokumentUtil {

    @Inject
    DokumentyRepoDb repo;

    @Deprecated 
    @GET
    @Path("/zip/{numer}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getZipedDokument(String guid, int numer) {
        int uid = getUid();
        var is = repo.getDane(guid, uid);
 
        StreamingOutput stream = output -> {
            try (ZipInputStream zis = new ZipInputStream(is)) {
                var entry = zis.getNextEntry();
                int idx = 0;
                while (entry != null && idx <= numer) {
                    if (idx == numer) {
                        zis.transferTo(output);
                    }
                    entry = zis.getNextEntry();
                    idx++; }
            }catch(Exception e){
                System.err.println(e);
            }
        };

        return Response.ok(stream)
                .header("Content-Disposition", "inline")
                .header("Content-Type", "application/pdf")
                // .header("X-Content-Type-Options", "nosniff")
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getDokument(String guid) {
        int uid = getUid();
        var is = repo.getDane(guid, uid);
 
        StreamingOutput stream = output -> {
            try  {
                is.transferTo(output);

            }catch(Exception e){
 System.err.println(e);
            }
        };

        return Response.ok(stream)
                .header("Content-Disposition", "inline")
                .header("Content-Type", "application/pdf")
                // .header("X-Content-Type-Options", "nosniff")
                .build();
    }
    private int getUid() {

        return -1;
    }
}
