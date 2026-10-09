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
"use server"

import { query, tested_query } from "@/lib/db"
import { parseQueryForSearch } from "@/lib/utils"
import { get_uid } from "../actions"

export async function insert_klasyfikacja({ komorka, symbol, grupa, rok, haslo, status, dostep, klasa_archiwum }: any): Promise<any> {
    const sql = `INSERT INTO ezd.klasyfikacje(
	komorka, symbol, grupa, rok, haslo)
	VALUES ($1, $2, $3::integer, $4, $5) RETURNING id`
    const ret = await query(sql, [komorka, symbol, grupa, rok, haslo])
    return ret.rows[0];
}

export async function insert_sprawa({ znak, zakladajacy, prowadzacy, data_zalozenia, data_ostanieago_aktu, tytul, dostep, opis, klasa_archiwum }: any): Promise<any> {
    const sql = `INSERT INTO ezd.sprawy(
	znak, zakladajacy, prowadzacy, data_zalozenia, data_ostanieago_aktu, tytul, dostep, opis, klasa_archiwum, uid)
    VALUES($1, ezd.json_to_pracownik($2::json), ezd.json_to_pracownik_array($3::json), $4, $5, $6, $7, $8, $9, $10)`
    const uid = await get_uid()
    const ret = await query(sql, [znak, zakladajacy, JSON.stringify(prowadzacy), data_zalozenia, data_ostanieago_aktu, tytul, dostep, opis, klasa_archiwum, uid])
    return ret.rows[0];
}

export async function delete_sprawa(znak: string): Promise<any> {
    const sql = `DELETE FROM ezd.sprawy WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}

export async function insert_czynnosc({ znak, data_czynnosci, podejmujacy, czynnosc, guid = null, znak_pisma = null }: any): Promise<any> {
    const sql = `
  WITH metryka AS (
    SELECT znak FROM ezd.sprawy WHERE znak = $1 AND uid = $7
    UNION
    SELECT znak FROM ezd.negaty WHERE znak = $1 AND uid = $7
  )
  INSERT INTO ezd.czynnosci( znak, data_czynnosci, podejmujacy, czynnosc, guid, znak_pisma )
	SELECT $1, $2, ezd.json_to_pracownik($3::json), $4, $5, $6 FROM metryka 
        RETURNING id`
    const uid = await get_uid()
    const ret = await query(sql, [znak, data_czynnosci, podejmujacy, czynnosc, guid, znak_pisma, uid])
    return ret.rows[0];
}


export async function info_sprawy(znak: string): Promise<any> {
    const sql = `SELECT znak, uid, gid, inne FROM ezd.sprawy WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}

export async function set_uid_sprawy(znak: string, new_uid: number): Promise<any> {
    const sql = `UPDATE ezd.sprawy SET uid = $3 WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, new_uid])
    return ret.rows[0];
}

export async function set_gid_sprawy(znak: string, new_gid: number): Promise<any> {
    const sql = `UPDATE ezd.sprawy SET gid = $3 WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, new_gid])
    return ret.rows[0];
}

export async function add_inne_sprawy(znak: string, id: number): Promise<any> {
    const sql = `UPDATE ezd.sprawy SET inne = array_append(inne,$3) WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, id])
    return ret.rows[0];
}

export async function remove_inne_sprawy(znak: string, id: number): Promise<any> {
    const sql = `UPDATE ezd.sprawy SET inne = array_remove(inne,$3) WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, id])
    return ret.rows[0];
}

export async function clear_inne_sprawy(znak: string): Promise<any> {
    const sql = `UPDATE ezd.sprawy SET inne = null WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}


// AKTA
const POZOSTALE = "SELECT znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, data_wlaczenia, rodzaj, tytul, dostep, format, typ, sprawy, negaty, pozycja FROM ezd.akta_pozostale"
const WPLYWAJACE = "SELECT znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, array_to_json(nazwa_nadawcy) nazwa_nadawcy, row_to_json(adres_nadawcy) adres_nadawcy, email, ade, data_na_pismie, data_nadania, data_wplywu, data_rejestracji, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, znak_nadawcy, sprawy, negaty, pozycja FROM ezd.wplywajace"
const WYCHODZACE = "SELECT znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, array_to_json(nazwa_adresata) nazwa_adresata, row_to_json(adres_adresata) adres_adresata, email, ade, data_na_pismie, data_nadania, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_wysylki, znak_nadany, sprawy, negaty, pozycja FROM ezd.wychodzace"

export async function akta_sprawy(znak: string): Promise<any> {

    const uid = await get_uid()

    const WHERE = " WHERE $1 = ANY(sprawy)  AND (ARRAY[uid,gid] || inne)::integer[] && ids($2)"

    const pozostale = await query(`${POZOSTALE} ${WHERE}`, [znak, uid])
    const wplywajace = await query(`${WPLYWAJACE} ${WHERE}`, [znak, uid])
    const wychodzace = await query(`${WYCHODZACE} ${WHERE}`, [znak, uid])

    const result: any[] = []

    wplywajace.rows.map(rec => {
        return { ...rec }
    }).forEach(p => result.push(p))
    pozostale.rows.map(rec => {
        return { ...rec }
    }).forEach(p => result.push(p))
    wychodzace.rows.map(rec => {
        return { ...rec }
    }).forEach(p => result.push(p))

    return result;
}

export async function akta(znak_kancelarii: string): Promise<any> {
    const uid = await get_uid()

    const WHERE = "WHERE znak_kancelarii = $1  AND (ARRAY[uid,gid] || inne)::integer[] && ids($2)"

    const pozostale = await query(`${POZOSTALE} ${WHERE}`, [znak_kancelarii, uid])
    if (pozostale.rowCount == 1)
        return { ...pozostale.rows[0] }

    const wplywajace = await query(`${WPLYWAJACE} ${WHERE}`, [znak_kancelarii, uid])
    if (wplywajace.rowCount == 1)
        return { ...wplywajace.rows[0] }


    const wychodzace = await query(`${WYCHODZACE} ${WHERE}`, [znak_kancelarii, uid])
    if (wychodzace.rowCount == 1)
        return { ...wychodzace.rows[0] }

    return null;
}

export async function akta_pozostale(term: string, limit: number = 20, offset: number = 0):Promise<any>{

      const WHERE = ` WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
    --$2-IS-NULL-- AND length($2::text) IS NULL
    --$2-- AND (to_tsvector(znak_kancelarii||' '||tytul||' '||COALESCE(znak, '')) @@ to_tsquery($2::text) 
    --$2-- OR znak LIKE $2 OR znak_kancelarii LIKE $2)
    --$3-IS-NULL-- AND length($3) IS NULL
    --$3-- AND data_wlaczenia::date >= $3
    --$4-IS-NULL-- AND length($4) IS NULL
    --$4-- AND data_wlaczenia::date <= $4
      `
      const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)
    
      const sql_count = `
    SELECT count(*) c FROM ezd.akta_pozostale 
    `
      const uid = await get_uid()
      const rs_count = await tested_query(sql_count + WHERE, [uid, zawiera, dataOd, dataDo])
      const count = rs_count.rows[0].c;
    
      const rs = await tested_query(POZOSTALE + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
      const dane = rs.rows.map(rec => {
        return { ...rec }
      })

      return { count, limit, offset, dane }
}

export async function wplywajace(term: string, limit: number = 20, offset: number = 0) {

  const WHERE = ` WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (to_tsvector(znak_kancelarii||' '||array_to_string(nazwa_nadawcy,' ')||COALESCE(znak, '')) @@ to_tsquery($2::text) 
--$2-- OR znak LIKE $2 OR znak_kancelarii  LIKE $2)
--$3-IS-NULL-- AND length($3) IS NULL
--$3-- AND LEAST(data_nadania::date, data_na_pismie::date) >= $3
--$4-IS-NULL-- AND length($4) IS NULL
--$4-- AND GREATEST(data_nadania::date, data_na_pismie::date) <= $4
  `
  const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)

  const sql_count = "SELECT count(*) c FROM ezd.wplywajace "

  const uid = await get_uid()
  const rs_count = await tested_query(sql_count + WHERE, [uid, zawiera, dataOd, dataDo])
  const count = rs_count.rows[0].c;

  const rs = await tested_query(WPLYWAJACE + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function wychodzace(term: string, limit: number = 20, offset: number = 0) {

  const WHERE = ` WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (to_tsvector(znak_kancelarii||' '||array_to_string(nazwa_adresata,' ')||COALESCE(znak, '')) @@ to_tsquery($2::text) 
--$2-- OR znak LIKE $2 OR znak_kancelarii  LIKE $2)
--$3-IS-NULL-- AND length($3) IS NULL
--$3-- AND LEAST(data_nadania::date, data_na_pismie::date) >= $3
--$4-IS-NULL-- AND length($4) IS NULL
--$4-- AND GREATEST(data_nadania::date, data_na_pismie::date) <= $4
  `
  const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)

  const sql_count = `
SELECT count(*) c FROM ezd.wychodzace 
`

  const uid = await get_uid()
  const rs_count = await tested_query(sql_count + WHERE, [uid, zawiera, dataOd, dataDo])

  const count = rs_count.rows[0].c;

  const rs = await tested_query(WYCHODZACE + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function insert_akta_pozostaele({ znak_kancelarii, guid, odpowiedzialny, data_wlaczenia, rodzaj, tytul, dostep, format, typ, pozycja }: any):Promise<any>{
    const sql =`INSERT INTO ezd.akta_pozostale(
	znak_kancelarii, guid, odpowiedzialny, data_wlaczenia, rodzaj, tytul, dostep, format, typ, znak, pozycja, uid)
    VALUES($1,$2, ezd.json_to_pracownik_array($3),$4,$5,$6,$7,$8,$9,$10,$11)`
    const uid = await get_uid()
    const ret = await query(sql, [znak_kancelarii, guid, JSON.stringify(odpowiedzialny), data_wlaczenia, rodzaj, tytul, dostep, format, typ, pozycja, uid])
    return ret.rows[0];
}

export async function insert_wplywajaca({ znak_kancelarii, guid, odpowiedzialny, nazwa_nadawcy, adres_nadawcy, email, ade, data_na_pismie, data_nadania, data_wplywu, data_rejestracji, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, znak_nadawcy, pozycja }:any){
    const sql =`INSERT INTO ezd.wplywajace(
	znak_kancelarii, guid, odpowiedzialny, nazwa_nadawcy, adres_nadawcy, email, ade, 
        data_na_pismie, data_nadania, data_wplywu, data_rejestracji, 
        rodzaj, tytul, dostep, liczba_zalacznikow, 
        format, uwagi, typ, sposob_dostarczenia, 
        znak_nadawcy, znak, pozycja, uid)
    VALUES($1,$2, ezd.json_to_pracownik_array($3),ezd.json_to_nazwa_podmiotu_array($4),ezd.json_to_adres_pocztowy($5),$6,$7,
        $8,$9,$10,$11,
        $12,$13, $14::ezd.dostep_typ, $15,
        $16,$17,$18,$19,
        $20,$21,$22
        )`
    const uid = await get_uid()
    const ret = await query(sql, [znak_kancelarii, guid, JSON.stringify(odpowiedzialny), JSON.stringify(nazwa_nadawcy), adres_nadawcy, email, ade, data_na_pismie, data_nadania, data_wplywu, data_rejestracji, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, znak_nadawcy, pozycja, uid])
    return ret.rows[0];
}

export async function insert_wychodzaca({ znak_kancelarii, guid, odpowiedzialny, nazwa_adresata, adres_adresata, email, ade, data_na_pismie, data_nadania, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_wysylki, znak_nadany, pozycja }:any){
    const sql = `INSERT INTO ezd.wychodzace(
	znak_kancelarii, guid, odpowiedzialny, nazwa_adresata, adres_adresata, email, ade, data_na_pismie, data_nadania, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_wysylki, znak_nadany,  pozycja, uid)
	   VALUES($1,$2, ezd.json_to_pracownik_array($3),ezd.json_to_nazwa_podmiotu_array($4),ezd.json_to_adres_pocztowy($5),$6,$7,
        $8,$9,$10,$11,
        $12::ezd.dostep_typ, $13, $14, $15,
        $16,$17,$18,$19,$20)`
    const uid = await get_uid()
    const ret = await query(sql, [znak_kancelarii, guid, JSON.stringify(odpowiedzialny), JSON.stringify(nazwa_adresata), adres_adresata, email, ade, data_na_pismie, data_nadania, rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_wysylki, znak_nadany, pozycja,uid])
    return ret.rows[0];
}

export async function delete_akta(znak_kancelarii: string){
    const sql=`
WITH del_wych AS (
  DELETE FROM ezd.wychodzace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
del_wpl AS (
  DELETE FROM ezd.wplywajace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2 RETURNING znak_kancelarii 
),
del_poz AS (
  DELETE FROM ezd.akta_pozostale WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2 RETURNING znak_kancelarii 
)
SELECT * FROM del_wych
UNION
SELECT * FROM del_wpl
UNION
SELECT * FROM del_poz`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function info_akta(znak_kancelarii:string){
    const sql = `
SELECT znak_kancelarii, guid, gid, uid, inne FROM ezd.wychodzace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
UNION
SELECT znak_kancelarii, guid, gid, uid, inne FROM ezd.wplywajace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
UNION
SELECT znak_kancelarii, guid, gid, uid, inne FROM ezd.akta_pozostale WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
    `
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function set_uid_akta(znak_kancelarii: string , new_uid: number){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET uid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET uid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET uid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, new_uid])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function set_gid_akta(znak_kancelarii: string , new_uid: number){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET gid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET gid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET gid = $3 WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, new_uid])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function add_inne_akta(znak_kancelarii: string , new_uid: number){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET inne = array_append(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET inne = array_append(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET inne = array_append(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, new_uid])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function remove_inne_akta(znak_kancelarii: string , new_uid: number){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET inne = array_remove(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET inne = array_remove(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET inne = array_remove(inne,$3) WHERE uid= $1 AND znak_kancelarii = $2  RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, new_uid])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}


export async function add_oznaczenie_akta(znak_kancelarii: string , {typ, znak} : {typ: string, znak: string} ){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET sprawy = array_append(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET sprawy = array_append(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET sprawy = array_append(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_wych_negat AS (
  UPDATE ezd.wychodzace SET negaty = array_append(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
),
upd_wpl_negat AS (
  UPDATE ezd.wplywajace SET negaty = array_append(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
),
upd_poz_negat AS (
  UPDATE ezd.akta_pozostale SET negaty = array_append(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
UNION
SELECT * FROM upd_wych_negat
UNION
SELECT * FROM upd_wpl_negat
UNION
SELECT * FROM upd_poz_negat
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, znak, typ])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
  
}

export async function remove_oznaczenie_akta(znak_kancelarii: string , {typ, znak} : {typ: string, znak: string} ){
    const sql =`
WITH upd_wych AS (
  UPDATE ezd.wychodzace SET sprawy = array_remove(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_wpl AS (
  UPDATE ezd.wplywajace SET sprawy = array_remove(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_poz AS (
  UPDATE ezd.akta_pozostale SET sprawy = array_remove(sprawy ,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'SPRAWA' = $4 RETURNING znak_kancelarii 
),
upd_wych_negat AS (
  UPDATE ezd.wychodzace SET negaty = array_remove(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
),
upd_wpl_negat AS (
  UPDATE ezd.wplywajace SET negaty = array_remove(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
),
upd_poz_negat AS (
  UPDATE ezd.akta_pozostale SET negaty = array_remove(negaty,$3) WHERE uid= $1 AND znak_kancelarii = $2  AND 'NEGAT' = $4 RETURNING znak_kancelarii 
)
SELECT * FROM upd_wych
UNION
SELECT * FROM upd_wpl
UNION
SELECT * FROM upd_poz
UNION
SELECT * FROM upd_wych_negat
UNION
SELECT * FROM upd_wpl_negat
UNION
SELECT * FROM upd_poz_negat
`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak_kancelarii, znak, typ])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
  
}

const AKTA_CHECK=`
    SELECT znak_kancelarii, uid FROM ezd.wychodzace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
    UNION
    SELECT znak_kancelarii, uid FROM ezd.wplywajace WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
    UNION
    SELECT znak_kancelarii, uid FROM ezd.akta_pozostale WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) AND znak_kancelarii = $2
`
export async function potwierdzenia(znak_kancelarii: string){
  const sql = `WITH akta AS ( ${AKTA_CHECK} )
  SELECT id, znak_kancelarii, typ, opis, data_operacji, guid
	FROM ezd.potwierdzenia WHERE znak_kancelarii IN (SELECT znak_kancelarii FROM akta)
  `
  const uid = await get_uid()
  const rs = await query(sql, [uid, znak_kancelarii])
  return rs.rows.map(rec => {
    return { ...rec }
  })
}

export async function insert_potwierdzenie({ znak_kancelarii, typ, opis, data_operacji, guid }:any){
  const sql = `
  WITH akta AS ( ${AKTA_CHECK} )
  INSERT INTO ezd.potwierdzenia(
	 znak_kancelarii, typ, opis, data_operacji, guid)
	SELECT  $2, $3, $4, $5, $6 FROM akta RETURNING id`
  const uid = await get_uid()
  const ret = await query(sql, [uid, znak_kancelarii, typ, opis, data_operacji, guid ])
  if(ret.rowCount==1){
    return ret.rows[0]
  }
  return null
}

export async function delete_potwierdzenie(znak_kancelarii :string, id :number ){
  const sql = `WITH akta AS (${AKTA_CHECK})
  DELETE FROM ezd.potwierdzenia 
    WHERE znak_kancelarii in (SELECT znak_kancelarii FROM akta) 
      AND znak_kancelarii = $2 AND id = $3  RETURNING id`
     const uid = await get_uid()
  const ret = await query(sql, [uid, znak_kancelarii, id ])
  if(ret.rowCount==1){
    return ret.rows[0]
  }
  return null   
}

export async function nastepny_znak(klasyfikacja: string){
  const sql = "select ezd.nastepny_znak($1) znak"
  const ret = await query(sql, [klasyfikacja])
  if(ret.rowCount==1){
    return ret.rows[0]
  }
  return null  
}

export async function insert_negat({ znak, tytul, opis }: any): Promise<any> {
    const sql = `INSERT INTO ezd.negaty(znak, tytul,opis, uid)
    VALUES($1, $2, $3, $4)`
    const uid = await get_uid()
    const ret = await query(sql, [znak, tytul, opis, uid])
    return ret.rows[0];
}

export async function delete_negat(znak: string): Promise<any> {
    const sql = `DELETE FROM ezd.negaty WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}

export async function info_negat(znak: string): Promise<any> {
    const sql = `SELECT znak, uid, gid, inne FROM ezd.negaty WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}

export async function set_uid_negat(znak: string, new_uid: number): Promise<any> {
    const sql = `UPDATE ezd.negaty SET uid = $3 WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, new_uid])
    return ret.rows[0];
}

export async function set_gid_negat(znak: string, new_gid: number): Promise<any> {
    const sql = `UPDATE ezd.negaty SET gid = $3 WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, new_gid])
    return ret.rows[0];
}

export async function add_inne_negat(znak: string, id: number): Promise<any> {
    const sql = `UPDATE ezd.negaty SET inne = array_append(inne,$3) WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, id])
    return ret.rows[0];
}

export async function remove_inne_negat(znak: string, id: number): Promise<any> {
    const sql = `UPDATE ezd.negaty SET inne = array_remove(inne,$3) WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak, id])
    return ret.rows[0];
}

export async function clear_inne_negat(znak: string): Promise<any> {
    const sql = `UPDATE ezd.negaty SET inne = null WHERE uid = $1 AND znak = $2`
    const uid = await get_uid()
    const ret = await query(sql, [uid, znak])
    return ret.rows[0];
}


