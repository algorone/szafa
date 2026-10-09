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
import { wychodzaca } from "../actions";
import { WYCHODZACE_META } from "./meta_meta";
import { Odpowiedzialni } from "./common";
import { potwierdzenia } from "@/app/api/actions";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PDFPreview from "@/components/ui/pdfpreview";

const emptyObject = {};

export function Wychodzaca(props: any) {
    const znakPisma = props?.znakPisma
    const postwierdzenia  = props?.potwierdzenia||false
    const [dane, setDane] = useState<any>(emptyObject)
    const [panding, setTransition] = useTransition()

    useEffect(() => {
        var dane: any[] = []
        setTransition(async () => {
            const resp = await wychodzaca(znakPisma)
            setDane(resp)
        })
    }, [znakPisma])

    return (<>
        {panding && <>ładuję ...</>}
        {!panding && WychodzacaKafelek({ dane })}
    </>)
}

export function WychodzacaKafelek({ dane }: any) {
    return (<><div className="grid grid-cols-12">
        <div className="border-b col-span-full"><Odpowiedzialni pracownicy={dane?.odpowiedzialny} /><Label klucz="1" /></div>
        <div className="border-b col-span-3"><AdresatNazwa nazwa_adresata={dane?.nazwa_adresata} /><Label klucz="2" /></div>
        <div className="border-x border-b col-span-5"><AdresatAdresPocztowy adres={dane?.adres_adresata} /><Label klucz="3" /></div>
        <div className="border-b col-span-4"><AdresEmailAde mail={dane?.email} ade={dane?.ade}  /><Label klucz="3h" />/<Label klucz="3i" /></div>
        {/* <div className="border-l border-b col-span-"><AdreaDoreczenElekronicznych ade={dane?.ade} /><Label klucz="3i" /></div> */}
        <div className="border-b col-span-2"><DataNaPismie data_na_pismie={dane?.data_na_pismie} /><Label klucz="4" /></div>
        <div className="border-b border-x col-span-2"><DataNadania data_nadania={dane?.data_nadania} /><Label klucz="5" /></div>
        <div className="border-b border-r col-span-2"><OznaczenieRodzaju oznaczenie_rodzaju={dane?.rodzaj} /><Label klucz="6" /></div>
        <div className="border-b col-span-6"><IdentyfikatorDokumentu guid={dane?.guid} /><Label klucz="7" /></div>
        <div className="border-b col-span-8"><Tytul tytul={dane?.tytul}/><Label klucz="8" /></div>
        <div className="border-b border-x col-span-1"><Dostep dostep={dane?.dostep} /><Label klucz="9" /></div>
        <div className="border-b border-r col-span-2"><LiczbaZalacznikow liczba_zalacznikow={dane?.liczba_zalacznikow} /><Label klucz="10" /> </div>
        <div className="border-b col-span-1"><Format format={dane?.format} /><Label klucz="11" /></div>
        <div className="borderex row-span-2 col-span-8"><Uwagi uwagi={dane?.uwagi} /><Label klucz="12" /></div>
        <div className="border-x col-span-2"><Typ typ={dane?.typ} /><Label klucz="13" /></div>
        <div className="borderex col-span-2  "><SposobWysylki sposob_wysylki={dane?.sposob_wysylki} /><Label klucz="14" /></div>
    </div>

    </>)

}


const emptyList: any[] = [];
export function Potwierdzenia(props: any){
    const znakPisma = props?.znakPisma
    const [dane, setDane] = useState<any[]>(emptyList)
    const [panding, setTransition] = useTransition()

    useEffect(() => {
        var dane: any[] = []
        setTransition(async () => {
            const resp = await potwierdzenia(znakPisma)
            console.log(JSON.stringify(resp))
            setDane(resp)
        })
    }, [znakPisma])

    return(<Table className="border-collapse border w100 text-xs">
        <TableHeader>
            <TableHead className="border text-xs bg-sidebar p-2" colSpan={4}>Potwierdzenia</TableHead>
            </TableHeader>
        <TableHeader>
            <TableHead className="border p-2">Typ</TableHead>
            <TableHead className="border p-2">Opis</TableHead>
            <TableHead className="border p-2">Data operacji</TableHead>
            <TableHead className="border p-2">identyfikator</TableHead>
        </TableHeader>
                <TableBody className="text-sm">
            {!panding && <>
                {dane.map((r: any) =><TableRow>
                    <TableCell className="border p-2">{r?.typ}</TableCell>
                    <TableCell className="border p-2">{r?.opis}</TableCell>
                    <TableCell className="border p-2">{r?.data_operacji?.toISOString()}</TableCell>
                    <TableCell className="border p-2"><span>
                                    
                             <PDFPreview url={"/ezd/api/preview/"+r?.guid+"?link.pdf"}>{r?.guid}</PDFPreview>
<a href={"/ezd/api/dokumenty/"+r.guid}  download> (pobierz) </a>
                    </span>

                    </TableCell>

                </TableRow>)}
                </>}
                </TableBody>
        
    </Table>)

}

export function SposobWysylki({ sposob_wysylki }: any) {
    return (<span className="block">{sposob_wysylki}</span>)
}

export function Typ({ typ }: any) {
    return (<span className="">{typ}</span>)
}

export function Uwagi({ uwagi }: any) {
    return (<span className="">{uwagi}</span>)
}

export function Format({ format }: any) {
    return (<span className="">{format}</span>)
}


export function LiczbaZalacznikow({ liczba_zalacznikow }: any) {
    return (<span className="">{liczba_zalacznikow}</span>)
}

export function Dostep({ dostep }: any) {
    return (<span className="">{dostep}</span>)
}

export function Tytul({ tytul }: any) {
    return (<span className="font-semibold block">{tytul}</span>)
}

export function IdentyfikatorDokumentu({ guid }: any) {
    return (<span className="text-nowrap block">  
        <PDFPreview url={"/ezd/api/preview/"+guid+"?link.pdf"}>{guid}</PDFPreview>
        <a href={"/ezd/api/dokumenty/"+guid}  download> (pobierz) </a>
    </span>
  
  )
}

export function OznaczenieRodzaju({ oznaczenie_rodzaju }: any) {
    return (<span>
        {oznaczenie_rodzaju}
    </span>)
}

export function DataNadania({ data_nadania }: any) {
    return (<span className="block">
        {data_nadania}
    </span>)
}


export function DataNaPismie({ data_na_pismie }: any) {
    return (<span className="block">
        {data_na_pismie}
    </span>)
}

export function AdreaDoreczenElekronicznych({ ade }: any) {
    return (<span>
        {ade}
    </span>)
}

export function AdresEmail({ email }: any) {
    return (<span className="flex gap-1">
        {Array.isArray(email) && email.map((mail: any, idx: any) =>
            <span key={idx}>{mail}</span>)}
    </span>)
}

export function AdresEmailAde({ email, ade }: any) {
    return (<span className="flex gap-1">
        {Array.isArray(email) && email.map((mail: any, idx: any) =>
            <span key={idx}>{mail}</span>)}
            <span>{ade}</span>
    </span>)

}

export function AdresatAdresPocztowy({ adres }: any) {
    return (<span className="flex gap-1">
        <span>{adres?.kod_pocztowy}</span>
        <span>{adres?.miejscowosc}</span>
        <span>{adres?.ulica}</span>
        <span>{adres?.budynek}</span>
        <span>{adres?.lokal}</span>
        <span>{adres?.skrytka}</span>
        <span>{adres?.kraj}</span>
    </span>)
}

export function AdresatNazwa({ nazwa_adresata }: any) {
    return (<span className="">

        {Array.isArray(nazwa_adresata) && nazwa_adresata.map((adresat: any, idx: any) => <span key={idx} className="flex gap-1">
            <span>{adresat.imie}</span>
            <span>{adresat.nazwisko}</span>
            <span>{adresat.nazwa}</span>
        </span>)}

    </span>)
}


export function Label({ klucz, cn = "" }: { klucz: string; cn?: string }) {
    return (
        <span className={`text-muted-foreground ${cn} text-xs`}>
            {/* {klucz}. */}
             {WYCHODZACE_META.get(klucz)?.label}
        </span>
    );
}