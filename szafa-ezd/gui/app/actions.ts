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
import { cookies } from "next/headers"

function rec2klasyfikacja(rec: any) {
  return {
    komorka: rec.komorka, symbol: rec.symbol, grupa: rec.grupa,
    rok: rec.rok, haslo: rec.haslo, status: rec.status, data_zalozenia: rec.data_zalozenia,
    dostep: rec.dostep, klasa_archiwum: rec.klasa_archiwum
  }
}
export async function klasyfikacje(): Promise<any[]> {
  const rs = await query(
    `SELECT id, komorka, symbol, grupa, rok, haslo, status, data_zalozenia, dostep, klasa_archiwum
	   FROM ezd.klasyfikacje`)
  return rs.rows.map(rec => rec2klasyfikacja(rec))
}

export async function klasyfikacje_latami(term: any, limit: number = 50, offset: number = 0): Promise<any> {
  const sql = `
SELECT komorka, symbol, grupa,
  haslo,
  json_agg(json_build_object('rok',rok, 'id', id, 
  'znak', komorka||'.'||symbol||CASE WHEN grupa IS NOT NULL THEN '.'||grupa ELSE '' END||'.'||rok)) lata
FROM ezd.klasyfikacje `
  const GROUP_BY = `
GROUP BY komorka, symbol, grupa, haslo
ORDER BY symbol, grupa
`
  const WHERE = ` WHERE 1=1
--$1-IS-NULL-- AND length($1::text) IS NULL
--$1-- AND (to_tsvector(komorka||' '||symbol||COALESCE(haslo,'')) @@ to_tsquery($1::text) 
--$1-- OR komorka||'.'||symbol LIKE $1 
--$1-- OR komorka||'.'||symbol||'.'||grupa LIKE $1 )

`
  const sql_count = `
SELECT count(*) c FROM ezd.klasyfikacje 
`
  const uid = await get_uid()
  const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)

  const rs_count = await tested_query(sql_count + WHERE, [zawiera])

  const count = rs_count.rows[0].c;
  const rs = await tested_query(sql + WHERE + GROUP_BY + ' OFFSET $2 LIMIT $3 ', [zawiera, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }

}

function rec2sprawa(rec: any) {
  return { rec }
}
export async function sprawy4klasyfikacja(znak: string, limit: number = 50, offset: number = 0): Promise<any> {
  const sql = `
SELECT
  znak, zakladajacy, prowadzacy, 
  to_char(data_zalozenia, 'yyyy-MM-dd HH:mm') data_zalozenia, 
  to_char(data_ostanieago_aktu, 'yyyy-MM-dd HH:mm') data_ostanieago_aktu, 
  tytul, dostep, opis
FROM ezd.sprawy 
WHERE
  (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
  AND znak ~ $2
  `
  const sql_count = `
SELECT count(*) c FROM ezd.sprawy
WHERE
  (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
  AND znak ~ $2
`
  const pos = znak.lastIndexOf('.')
  const term = znak.substring(0, pos) + '.[0-9]*' + znak.substring(pos)
  const uid = await get_uid()
  const rs_count = await tested_query(sql_count, [uid, term])
  const count = rs_count.rows[0].c;

  const rs = await tested_query(sql + ' OFFSET $3 LIMIT $4 ', [uid, term, offset, limit])
  const dane = rs.rows.map(rec => {
    return rec2sprawa(rec)
  })

  return { count, limit, offset, dane }


  return []
}

export async function sprawy(term: any, limit: number = 50, offset: number = 0): Promise<any> {
  const sql = `
SELECT
  znak, row_to_json(zakladajacy) zakladajacy, array_to_json(prowadzacy)  prowadzacy, 
  to_char(data_zalozenia, 'yyyy-MM-dd HH:mm') data_zalozenia, 
  to_char(data_ostanieago_aktu, 'yyyy-MM-dd HH:mm') data_ostanieago_aktu, 
  tytul, dostep, opis
FROM ezd.sprawy `

  const WHERE = `
 WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
--$2-IS-NULL-- AND length($2::text) IS NULL 
--$2-- AND (to_tsvector(znak||' '||tytul||COALESCE(opis,'')) @@ to_tsquery($2::text) 
--$2-- OR znak LIKE $2) 
--$3-IS-NULL-- AND length($3) IS NULL 
--$3-- AND LEAST(data_zalozenia, data_ostanieago_aktu) >= $3 
--$4-IS-NULL-- AND length($4) IS NULL 
--$4-- AND GREATEST(data_zalozenia, data_ostanieago_aktu) <= $4 
--$5-IS-NULL-- AND length($5) IS NULL 
--$5-- AND (ezd.split_klasyfikacja(znak)).jo = $5 
--$6-IS-NULL-- AND length($6) IS NULL 
--$6-- AND (ezd.split_klasyfikacja(znak)).rwa like $6||'%' 
--$7-IS-NULL-- AND length($7) IS NULL 
--$7-- AND (ezd.split_klasyfikacja(znak)).grupa like $7||'%' 
--$8-IS-NULL-- AND length($8) IS NULL 
--$8-- AND (ezd.split_klasyfikacja(znak)).grupa like $8||'%' 
`
  const [zawiera, nieZawiera, dataOd, dataDo,jo,rwa,grupa,rok] = parseQueryForSearch(term, true)

  const sql_count = `
SELECT count(*) c FROM ezd.sprawy
`

  const uid = await get_uid()
  const rs_count = await tested_query(sql_count + WHERE, [uid, zawiera, dataOd, dataDo, jo, rwa, grupa, rok])
  const count = rs_count.rows[0].c;

  const rs = await tested_query(sql + WHERE + ' OFFSET $9 LIMIT $10 ', [uid, zawiera, dataOd, dataDo, jo, rwa,grupa, rok, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function sprawa(znak: string): Promise<any> {
  const sql = `
SELECT 
  znak, row_to_json(zakladajacy) zakladajacy , array_to_json(prowadzacy)  prowadzacy, 
  to_char(data_zalozenia, 'yyyy-MM-dd HH:mm') data_zalozenia, 
  to_char(data_ostanieago_aktu, 'yyyy-MM-dd HH:mm') data_ostanieago_aktu, 
  tytul, dostep, opis,klasa_archiwum
FROM ezd.sprawy 
WHERE znak = $2 AND (ARRAY[uid,gid] || inne)::integer[] && ids($1)
  `
  const uid = await get_uid()
  const rs = await query(sql, [uid, znak])
  if (rs.rows.length == 1)
    return { ...rs.rows[0] }
  return null
}

export async function czynnosci(znak: string): Promise<any> {
  const sql = `
WITH metryka AS (
  SELECT znak, uid, gid, inne FROM ezd.sprawy WHERE znak = $2 
  UNION
  SELECT znak, uid, gid, inne FROM ezd.negaty WHERE znak = $2 
)
SELECT  c.znak, to_char(data_czynnosci, 'yyyy-MM-dd') data_czynnosci, row_to_json(podejmujacy) podejmujacy, czynnosc, guid, znak_pisma
FROM ezd.czynnosci c 
  INNER JOIN metryka s ON (c.znak=s.znak)
WHERE 
  (ARRAY[uid,gid] || inne)::integer[] && ids($1) 
  AND s.znak = $2 
  `
  const uid = await get_uid()
  const rs = await query(sql, [uid, znak])
  return rs.rows.map(rec => {
    return { ...rec }
  })
}

export async function akta_sprawy(znak: any): Promise<any> {
  const sql = `
SELECT 'wplywajace' typ, pozycja, znak_kancelarii klucz FROM ezd.wplywajace WHERE  $1 = ANY(sprawy)
UNION 
SELECT 'wychodzace' typ, pozycja, znak_kancelarii klucz FROM ezd.wychodzace WHERE $1 = ANY(sprawy)
UNION
SELECT 'akta_pozostale' typ,  pozycja, znak_kancelarii klucz FROM ezd.akta_pozostale WHERE $1 = ANY(sprawy)
 `
  const rs = await query(sql, [znak])
  return rs.rows.map(rec => {
    return { ...rec }
  })

}

export async function klasyfikacja(znak: string): Promise<any> {
  const sql = `
SELECT 
  id, komorka, symbol, grupa, rok, haslo, 
  status, data_zalozenia, 
  dostep, klasa_archiwum
FROM ezd.klasyfikacje 
WHERE 
  komorka||'.'||symbol||CASE WHEN grupa IS NOT NULL THEN '.'||grupa ELSE '' END||'.'||rok = $1
  `
  const rs = await query(sql, [znak])
  if (rs.rows.length == 1)
    return rec2klasyfikacja(rs.rows[0])
  return null
}


export async function klasyfikacja_pozycje(znak: string, offset: number = 0, limit: number = 20) {
  const sql = `
WITH grupy AS (
 SELECT komorka||'.'||symbol||'.'||grupa||'.'||rok as znak, grupa nr,
  'grupa' typ,
  null::ezd.pracownik, null::ezd.pracownik[] prowadzacy, null::text data_zalozenia, null data_ostanieago_aktu, 
  null::text tytul, null::ezd.dostep_typ dostep,  null:: text opis
 FROM ezd.klasyfikacje WHERE grupa is not null
),
pozycje AS (
SELECT znak znak,  split_part(znak, '.', -2)::int nr,'sprawa' typ,
 zakladajacy, prowadzacy, 
 to_char(data_zalozenia, 'yyyy-MM-dd HH:mm') data_zalozenia, 
 to_char(data_ostanieago_aktu, 'yyyy-MM-dd HH:mm') data_ostanieago_aktu, tytul, dostep, opis
 FROM ezd.sprawy 
 UNION
SELECT * FROM grupy)
SELECT * FROM pozycje
WHERE znak ~ $1
ORDER BY nr
  `
  const sql_count = `
WITH pozycje AS (
SELECT count(*) c
 FROM ezd.sprawy WHERE znak  ~ $1
UNION
SELECT count(*) c
 FROM ezd.klasyfikacje WHERE grupa is not null AND 
 komorka||'.'||symbol||'.'||grupa||'.'||rok ~ $1
)
SELECT sum(c) c FROM pozycje
`

  const pos = znak.lastIndexOf('.')
  const term = znak.substring(0, pos) + '.[0-9]*' + znak.substring(pos)
  const rs_count = await query(sql_count, [term])

  const count = rs_count.rows[0].c;

  const rs = await query(sql + ' OFFSET $2 LIMIT $3 ', [term, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function akta_pozostale_lista(term: string, limit: number = 20, offset: number = 0) {
  const sql = `
SELECT znak_kancelarii, guid, 
  array_to_json(odpowiedzialny) odpowiedzialny, 
  to_char(data_wlaczenia, 'yyyy-MM-dd mm:hh') data_wlaczenia,
  rodzaj, tytul, dostep, format, typ,
  sprawy, negaty, pozycja, uid, gid, inne
FROM ezd.akta_pozostale
  `
  const WHERE = ` WHERE $1 >-100
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND to_tsvector(znak_kancelarii||' '||tytul||' '||COALESCE(array_to_string(sprawy, ' '), '')) @@ to_tsquery($2::text) 
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

  const rs = await tested_query(sql + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function akta_pozostale(znak_kancelarii: string) {
  const sql = `
SELECT znak_kancelarii, guid, 
  array_to_json(odpowiedzialny) odpowiedzialny, 
  to_char(data_wlaczenia, 'yyyy-MM-dd mm:hh') data_wlaczenia,
  rodzaj, tytul, dostep, format, typ,
  sprawy, negaty, pozycja, uid, gid, inne
FROM ezd.akta_pozostale
WHERE znak_kancelarii = $1
`
  const rs = await query(sql, [znak_kancelarii])
  if (rs.rows.length == 1)
    return { ...rs.rows[0] }
  return null
}

export async function wplywajace(term: string, limit: number = 20, offset: number = 0) {
  const sql = `
SELECT znak_kancelarii, guid, 
  array_to_json(odpowiedzialny) odpowiedzialny , 
  array_to_json(nazwa_nadawcy) nazwa_nadawcy, 
  row_to_json(adres_nadawcy) adres_nadawcy, 
  email, ade, 
  data_na_pismie, 
  data_nadania, data_wplywu,
  to_char(data_rejestracji, 'yyyy-MM-dd mm:hh') data_rejestracji,  
  rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, 
  znak_nadawcy, sprawy, negaty, pozycja, uid, gid, inne
FROM ezd.wplywajace
  `
  const WHERE = ` WHERE $1 >-100
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (to_tsvector(znak_kancelarii||' '||array_to_string(nazwa_nadawcy,' ')||COALESCE(array_to_string(sprawy,' '), '')) @@ to_tsquery($2::text) 
--$2-- OR array_to_string(sprawy,' ') LIKE $2 OR znak_kancelarii  LIKE $2)
--$3-IS-NULL-- AND length($3) IS NULL
--$3-- AND LEAST(data_nadania::date, data_na_pismie::date) >= $3
--$4-IS-NULL-- AND length($4) IS NULL
--$4-- AND GREATEST(data_nadania::date, data_na_pismie::date) <= $4
  `
  const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)

  const sql_count = `
SELECT count(*) c FROM ezd.wplywajace 
`

  const uid = await get_uid()
  const rs_count = await tested_query(sql_count + WHERE, [uid, zawiera, dataOd, dataDo])

  const count = rs_count.rows[0].c;

  const rs = await tested_query(sql + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function wplywajaca(znak_kancelarii: string) {
  const sql = `
SELECT znak_kancelarii, guid, 
  array_to_json(odpowiedzialny) odpowiedzialny , 
  array_to_json(nazwa_nadawcy) nazwa_nadawcy, 
  row_to_json(adres_nadawcy) adres_nadawcy, 
  email, ade, 
  data_na_pismie, 
  data_nadania, data_wplywu,
  to_char(data_rejestracji, 'yyyy-MM-dd mm:hh') data_rejestracji,  
  rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, 
  znak_nadawcy, sprawy, negaty, pozycja, uid, gid, inne
FROM ezd.wplywajace
WHERE znak_kancelarii = $1
`
  const rs = await query(sql, [znak_kancelarii])
  if (rs.rows.length == 1)
    return { ...rs.rows[0] }
  return null
}

export async function wychodzace(term: string, limit: number = 20, offset: number = 0) {
  const sql = `
SELECT znak_kancelarii, guid, 
 array_to_json(odpowiedzialny) odpowiedzialny, 
 array_to_json(nazwa_adresata) nazwa_adresata, 
 row_to_json(adres_adresata) adres_adresata,
 email, ade, data_na_pismie, data_nadania,
 rodzaj, tytul, dostep, liczba_zalacznikow,
 format, uwagi, typ, sposob_wysylki, znak_nadany,
 sprawy, negaty, pozycja, wysylki, uid, gid, inne
FROM ezd.wychodzace
  `
  const WHERE = ` WHERE $1 >-100
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (to_tsvector(znak_kancelarii||' '||array_to_string(nazwa_adresata,' ')||COALESCE(array_to_string(sprawy,' '), '')) @@ to_tsquery($2::text) 
--$2-- OR array_to_string(sprawy,' ') LIKE $2 OR znak_kancelarii  LIKE $2)
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

  const rs = await tested_query(sql + WHERE + ' OFFSET $5 LIMIT $6 ', [uid, zawiera, dataOd, dataDo, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })

  return { count, limit, offset, dane }
}

export async function wychodzaca(znak_kancelarii: string): Promise<any> {
  const sql = `
SELECT znak_kancelarii, guid, 
 array_to_json(odpowiedzialny) odpowiedzialny, 
 array_to_json(nazwa_adresata) nazwa_adresata, 
 row_to_json(adres_adresata) adres_adresata,
 email, ade, data_na_pismie, data_nadania,
 rodzaj, tytul, dostep, liczba_zalacznikow,
 format, uwagi, typ, sposob_wysylki, znak_nadany,
 sprawy, negaty, pozycja, wysylki, uid, gid, inne
FROM ezd.wychodzace
WHERE znak_kancelarii = $1 
  `

  const rs = await query(sql, [znak_kancelarii])
  if (rs.rows.length == 1)
    return { ...rs.rows[0] }
  return null
}

export async function wyrozniki_akt(): Promise<any> {
  const sql = `
SELECT 'wplywajace' typ, 
  'Rejestry pism wpływających' opis, 
  json_agg(DISTINCT wyroznik)::jsonb wyrozniki 
FROM ezd.wplywajace
UNION
SELECT 'wychodzace' typ,
  'Rejestry pism wychodzących' opis,
  json_agg(DISTINCT wyroznik)::jsonb wyrozniki 
FROM ezd.wychodzace
UNION
SELECT 'akta_pozostale' typ, 
  'Rejestry akt pozostałych' opis, 
  json_agg(DISTINCT wyroznik)::jsonb wyrozniki 
FROM ezd.akta_pozostale
`
  const rs = await query(sql)
  return rs.rows.map(rec => {
    return { ...rec }
  })
}

export async function negaty(term: string, limit: number = 20, offset: number = 0){
  const sql = `
SELECT znak, tytul, opis FROM ezd.negaty
WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (tytul LIKE $2 OR znak LIKE $2)
OFFSET $3 LIMIT $4 
`
  const sql_count =`
SELECT count(*) c FROM ezd.negaty
WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
--$2-IS-NULL-- AND length($2::text) IS NULL
--$2-- AND (tytul LIKE $2 OR znak LIKE $2)
  `
  const uid = await get_uid()
  const [zawiera, nieZawiera, dataOd, dataDo] = parseQueryForSearch(term)
  const rs_count = await tested_query(sql_count , [uid, zawiera])

  const count = rs_count.rows[0].c;

  const rs = await tested_query(sql , [uid, zawiera, offset, limit])
  const dane = rs.rows.map(rec => {
    return { ...rec }
  })
  return { count, limit, offset, dane }
}

export async function negat(znak:any){
  const sql = `
SELECT znak, tytul, opis FROM ezd.negaty 
  WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
  AND znak = $2
  `
  const uid = await get_uid()
  const rs = await query(sql, [uid, znak])
  if (rs.rows.length == 1)
    return { ...rs.rows[0] }
  return null
}

export async function akta_negatu(znak: any): Promise<any> {
  const sql = `
SELECT 'wplywajace' typ, pozycja, znak_kancelarii klucz FROM ezd.wplywajace WHERE  $1 = ANY(negaty)
UNION 
SELECT 'wychodzace' typ, pozycja, znak_kancelarii klucz FROM ezd.wychodzace WHERE $1 = ANY(negaty)
UNION
SELECT 'akta_pozostale' typ,  pozycja, znak_kancelarii klucz FROM ezd.akta_pozostale WHERE $1 = ANY(negaty)
 `
  const rs = await query(sql, [znak])
  return rs.rows.map(rec => {
    return { ...rec }
  })

}

export async function get_uid() {
  const cookieStore = await cookies()
  if (cookieStore.has('IdToken')) {
    const idToken: any = cookieStore.get('IdToken')
    return parseInt(JSON.parse(atob(idToken['value'].split('.')[1])).uid)
  }
  if (cookieStore.has('moje_id')) {
    const moje_id: any = cookieStore.get('moje_id')
    const uid = JSON.parse(moje_id['value'])[0]
    return uid
  }
  return -1

}



