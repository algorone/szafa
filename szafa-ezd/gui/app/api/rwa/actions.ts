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

import { get_uid } from "@/app/actions"
import { query } from "@/lib/db"


export async function lata_rwa(): Promise<any> {
    const sql = `SELECT rok FROM ezd.rwa`
    const uid = await get_uid()
    const rs = await query(sql)
    const dane = rs.rows.map(rec => {
    return { ...rec }
  })
  return (dane)?dane:[]
}

export async function rwa(rok:number): Promise<any> {
    const sql = `SELECT rok, dane FROM ezd.rwa WHERE rok=$1`
    const uid = await get_uid()
    const ret = await query(sql, [rok])
    if (ret.rowCount == 1)
        return { ... ret.rows[0] }
    return null
}

export async function upsert_rwa(rok: number , dane :any): Promise<any> {
    const sql = `INSERT INTO ezd.rwa(rok, dane) VALUES ($1::integer, $2)
ON CONFLICT (rok)
DO UPDATE SET dane = $2
RETURNING rok`
    const uid = await get_uid()
    const ret = await query(sql, [rok, JSON.stringify(dane)])
    return {status: "OK"}
}