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
import { get_uid } from "@/app/actions"
import { query } from "@/lib/db"

const SQL = `
WITH sprawy AS  (
  SELECT
    znak, row_to_json(zakladajacy) zakladajacy, array_to_json(prowadzacy)  prowadzacy, 
    to_char(data_zalozenia, 'yyyy-MM-dd HH:mm') data_zalozenia, 
    to_char(data_ostanieago_aktu, 'yyyy-MM-dd HH:mm') data_ostanieago_aktu, 
    tytul, dostep, opis
  FROM ezd.sprawy WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
),
pozostale AS (
  SELECT
  	znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, data_wlaczenia, rodzaj, 
	tytul, dostep, format, typ, sprawy, negaty, pozycja 
  FROM ezd.akta_pozostale WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
),
wplywajace AS (
  SELECT 
    znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, array_to_json(nazwa_nadawcy) nazwa_nadawcy, 
    row_to_json(adres_nadawcy) adres_nadawcy, email, ade, data_na_pismie, data_nadania, data_wplywu, data_rejestracji, 
    rodzaj, tytul, dostep, liczba_zalacznikow, format, uwagi, typ, sposob_dostarczenia, znak_nadawcy, sprawy, negaty, pozycja 
  FROM ezd.wplywajace  WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
),
wychodzace AS (
  SELECT 
    znak_kancelarii, guid, array_to_json(odpowiedzialny) odpowiedzialny, array_to_json(nazwa_adresata) nazwa_adresata, 
    row_to_json(adres_adresata) adres_adresata, email, ade, data_na_pismie, data_nadania, rodzaj, tytul, dostep, 
    liczba_zalacznikow, format, uwagi, typ, sposob_wysylki, znak_nadany, sprawy, negaty, pozycja 
  FROM ezd.wychodzace  WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
),
negaty AS (
  SELECT 
  	znak, tytul, opis 
  FROM ezd.negaty WHERE (ARRAY[uid,gid] || inne)::integer[] && ids($1)
)

SELECT json_object_agg(nazwa, zagregowane_dane) AS agregat_json
FROM (
  SELECT json_agg(dane) zagregowane_dane, nazwa FROM 
  (
    SELECT 
      'sprawy' nazwa, row_to_json(s) dane
    FROM sprawy s WHERE s.znak = ANY($2::text[])
    UNION ALL
    SELECT
     'akta' nazwa, row_to_json(wp) dane
    FROM wplywajace wp WHERE wp.znak_kancelarii = ANY($3::text[])
    UNION ALL
    SELECT
     'akta' nazwa, row_to_json(wy) dane
    FROM wychodzace wy WHERE wy.znak_kancelarii = ANY($3::text[])
    UNION ALL
    SELECT
     'akta' nazwa, row_to_json(po) dane
    FROM pozostale po WHERE po.znak_kancelarii = ANY($3::text[])
    UNION ALL
    SELECT
     'negaty' nazwa, row_to_json(n) dane
    FROM negaty n  WHERE n.znak = ANY($4::text[])
  ) dane GROUP BY nazwa
) zbiorcze
`

export async function agregat(sprawy:string[], akta:string[], negaty:string[]): Promise<any> {

    const uid = await get_uid()
    const ret = await query(SQL, [uid, sprawy, akta, negaty])
    if (ret.rowCount == 1)
        return  ret.rows[0].agregat_json
    return null
}