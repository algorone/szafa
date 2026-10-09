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



import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.util.UUID;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Throwable exception) {
        String messageId = UUID.randomUUID().toString();
        String errorCode;
        String errorDescription;
        Response.Status status;

        // 1. Obsługa kontrolowanych błędów JAX-RS / HTTP (np. BadRequestException)
        if (exception instanceof WebApplicationException webAppException) {
            status = Response.Status.fromStatusCode(webAppException.getResponse().getStatus());
            errorCode = "VALIDATION_ERROR";
            errorDescription = exception.getMessage();
        } 
        // 2. Obsługa wszystkich innych nieoczekiwanych wyjątków (np. błędy SQL, NullPointer)
        else {
            // Logujemy pełny ślad stosu (stacktrace) na serwerze razem z messageId
            LOG.error("Błąd systemowy [ID: " + messageId + "]", exception);
            
            status = Response.Status.INTERNAL_SERVER_ERROR;
            errorCode = "SERVER_ERROR";
            errorDescription = "Wystąpił nieoczekiwany błąd serwera. Skontaktuj się z administratorem.";
        }

        // Zgodnie z openapi.yaml: mapujemy do ErrorInfo i pakujemy w tablicę (List.of)
        ErrorInfo errorInfo = new ErrorInfo(errorCode, errorDescription, messageId);

        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(errorInfo)
                .build();
    }
}

