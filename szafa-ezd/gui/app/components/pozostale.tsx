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
import React, { useEffect, useState, useTransition } from "react";
import { akta_pozostale } from "../actions";
import { POZOSTALE_META } from "./meta_meta";
import { Odpowiedzialni } from "./common";
import { IdentyfikatorDokumentu } from "./wychodzaca";

const emptyObject = {};

export function Pozostale(props: any) {
  const znakPisma = props?.znakPisma
  const [dane, setDane] = useState<any>(emptyObject)
  const [panding, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      const resp = await akta_pozostale(znakPisma)
      setDane(resp)
    })
  }, [znakPisma])

  return (
    <>
      {panding && <>ładuję ...</>}
      {!panding && AktaPozostaleKafelek({ dane })}
    </>
  )
}

export function AktaPozostaleKafelek({ dane }: any) {
  return (
    <div className="grid grid-cols-12">
      <div className="border-b border-r col-span-8"><Odpowiedzialni pracownicy={dane?.odpowiedzialny} /><Label klucz="1" /></div>
      <div className="border-b col-span-4"><DataWlaczenia data_wlaczenia={dane?.data_wlaczenia} /><Label klucz="2" /></div>
      <div className="border-b col-span-4"></div>
      <div className="border-b border-x col-span-2"><OznaczenieRodzaju oznaczenie_rodzaju={dane?.rodzaj} /><Label klucz="3" /></div>
      <div className="border-b col-span-6"><IdentyfikatorDokumentu guid={dane?.guid} /><Label klucz="4" /></div>
      <div className="borderex col-span-8"><Tytul tytul={dane?.tytul} /><Label klucz="5" /></div>
      <div className="border-x col-span-1"><Dostep dostep={dane?.dostep} /><Label klucz="6" /></div>
      <div className="border-r col-span-2"><Typ typ={dane?.typ} /><Label klucz="8" /></div>
      <div className="borderex col-span-1"><Format format={dane?.format} /><Label klucz="7" /></div>
    </div>
  )
}

export function Typ({ typ }: any) {
  return (
    <>
      <span className="block">{typ}</span>
    </>
  )
}

export function Format({ format }: any) {
  return (
    <>
      <span className="block">{format}</span>
    </>
  )
}

export function Dostep({ dostep }: any) {
  return (
    <>
      <span className="block">{dostep}</span>
    </>
  )
}

export function Tytul({ tytul }: any) {
  return (
    <>
      <span className="font-semibold block">{tytul}</span>
    </>
  )
}


export function OznaczenieRodzaju({ oznaczenie_rodzaju }: any) {
  return (
    <>
      <span className="block">{oznaczenie_rodzaju}</span>
    </>
  )
}

export function DataWlaczenia({ data_wlaczenia }: any) {
  return (
    <>
      <span className="block">{data_wlaczenia}</span>
    </>
  )
}

export function Label({ klucz, cn = "" }: { klucz: string; cn?: string }) {
  return (
    <span className={`text-muted-foreground ${cn} text-xs`}>
      {/* {klucz}.  */}
      {POZOSTALE_META.get(klucz)?.label}
    </span>
  )
}
