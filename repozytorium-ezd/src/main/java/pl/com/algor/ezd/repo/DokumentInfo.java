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

public class DokumentInfo{
    public String guid;
    public int rozmiar;
    public String mime;
    public int uid;
    public int gid;
    public int[] inne = new int[0];     
    public String dataUtworzenia;
    public String dataAktualizacji; 
    public String[] aranzacja;

    public DokumentInfo() {
    }
    
    public DokumentInfo(String guid, int rozmiar, String mime, int uid, int gid, int[] inne, String dataUtworzenia, String dataAktualizacji) {
        this.guid = guid;
        this.rozmiar = rozmiar;
        this.mime = mime;
        this.uid = uid;
        this.gid = gid;
        this.inne = inne;
        this.dataUtworzenia = dataUtworzenia;
        this.dataAktualizacji = dataAktualizacji;
    }
}