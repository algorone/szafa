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
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { queryParse } from "./query.parser"
import { NextRequest } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseQueryForSearch(term: string, klasyfikacja: boolean = false) {

  function parsePlDate(dateString: string) {
    const parts = dateString.split('.')
    if (parts.length == 3)
      return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0')
    else return null
  }

  var zawieraTerm: string | null = null
  var niezawieraTerm: string | null = null
  var dataOdTerm = null
  var dataDoTerm = null
  var jo = null
  var rwa =null
  var grupa =null
  var rok = null

  if (term != null && term != '') {
    const qo = queryParse(term.trim())

    qo.forEach((elem: any) => {
      if (typeof elem === 'string' || elem instanceof String) {
        if (zawieraTerm == null)
          zawieraTerm = '%'
        zawieraTerm += elem + '%'
      }

      else if (typeof elem.neg === 'string') {
        if (niezawieraTerm == null)
          niezawieraTerm = '%'
        niezawieraTerm += elem.neg + '%'
      }

      else if (typeof elem.od === 'string')
        dataOdTerm = parsePlDate(elem.od)
      else if (typeof elem.do === 'string')
        dataDoTerm = parsePlDate(elem.do)
       else if (typeof elem.klasyfikacja === 'string') {
          [jo, rwa, grupa, rok] = elem.klasyfikacja.split('.').map((item:string)=> item === '' ? null : item)
       }
    });
  }
  if(klasyfikacja)
    return [zawieraTerm, niezawieraTerm, dataOdTerm, dataDoTerm, jo, rwa, grupa, rok]
  else
    return [zawieraTerm, niezawieraTerm, dataOdTerm, dataDoTerm]
}
export function queryLimitOffsetTerm(request: NextRequest): any {
    const searchParams = request.nextUrl.searchParams;
    const limit_par = searchParams?.get('limit') || '20';
    const offset_par = searchParams?.get('offset') || '0';
    return [parseInt(limit_par, 10), parseInt(offset_par, 10), searchParams.get('term')];
}
