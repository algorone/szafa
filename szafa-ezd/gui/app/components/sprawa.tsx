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
import { useZnakRwa } from "@/lib/znakRwa";
import { akta_sprawy, czynnosci, sprawa } from "../actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Potwierdzenia, Wychodzaca } from "./wychodzaca";
import { Wplywajaca } from "./wplywajaca";
import { Pozostale } from "./pozostale";
import { Odpowiedzialni, Odpowiedzialny } from "./common";
import { CZYNNOSCI_META, SPRAWY_META } from "./meta_meta";
import Link from "next/link";

export function Sprawa(props: any) {
    return (
        <>
            <div className="flex h-full flex-col">
                <ScrollArea className="h-screen">
                    <div className="container py-10" >
                        <Table>
                            <TableHead>
                                <h1 style={{ "fontSize": "large" }}>Rzeczowy Wykaz Akt</h1>
                                <h2>Poziom: sprawa</h2>
                            </TableHead>

                            <TableHead style={{ textAlign: "right" }}>
                            </TableHead>
                        </Table>
                        <SprawaNaglowek metryka={true}/>
                        <AktaSprawy />
                    </div>
                </ScrollArea>

            </div>
        </>

    )
}


const emptyObject = {};
export function SprawaNaglowek({ metryka = false }: { metryka: boolean }) {
    const [dane, setDane] = useState<any>(emptyObject)
    const [panding, setTransition] = useTransition()
    const [znakRwa, setZnakRwa] = useZnakRwa()
    useEffect(() => {
        var dane: any[] = []
        setTransition(async () => {
            const resp = await sprawa(znakRwa)
            setDane(resp)
        })
    }, [znakRwa])


    return (<>

        <div className="grid grid-cols-12">
            <div className="border col-span-3 px-3 pt-1"><Odpowiedzialny pracownik={dane?.zakladajacy} /><Label klucz="1a" /></div>
            <div className="border-y border-r col-span-3 px-3 pt-1"><Odpowiedzialni pracownicy={dane?.prowadzacy} /><Label klucz="1b" /></div>
            <div className="border-y border-r col-span-3 px-3 pt-1"><div>{dane?.data_zalozenia}</div><Label klucz="2" /></div>
            <div className="border-y border-r col-span-3 px-3 pt-1"><div>{dane?.data_ostanieago_aktu}</div><Label klucz="3" /></div>
            {!metryka && <>
                <div className="border-x border-b col-span-3 px-3 pt-1"><div>{dane?.znak}</div><Label klucz="4" /></div>
                <div className="border-b border-r col-span-9 px-3 pt-1"><div>{dane?.tytul}</div><Label klucz="5" /></div></>}
            <div className="border-x border-b col-span-2 px-3 pt-1"><div>{dane?.klasa_archiwum}</div><Label klucz="10" /></div>
            <div className="border-r border-b col-span-10 px-3 pt-1"><div>{dane?.opis}</div><Label klucz="9" /></div>
        </div>
        {metryka&&<Metryka znak={dane?.znak} tytul={dane?.tytul} />}
    </>)
}

export function SprawaKafelek({dane}:{dane:any}) {

    return (<>

        <div className="grid grid-cols-12">
            <div className="border-r border-b col-span-3 px-3 pt-1"><div>{dane?.znak}</div><Label klucz="4" /></div>
            <div className="border-b col-span-9 px-3 pt-1"><div>{dane?.tytul}</div><Label klucz="5" /></div>
            <div className="border-r border-b col-span-3 px-3 pt-1"><Odpowiedzialny pracownik={dane?.zakladajacy} /><Label klucz="1a" /></div>
            <div className="border-b border-r col-span-3 px-3 pt-1"><Odpowiedzialni pracownicy={dane?.prowadzacy} /><Label klucz="1b" /></div>
            <div className="border-b border-r col-span-3 px-3 pt-1"><div>{dane?.data_zalozenia}</div><Label klucz="2" /></div>
            <div className="border-b col-span-3 px-3 pt-1"><div>{dane?.data_ostanieago_aktu}</div><Label klucz="3" /></div>
           
            <div className="border-r border-b col-span-2 px-3 pt-1"><div>{dane?.klasa_archiwum}</div><Label klucz="10" /></div>
            <div className="border-b col-span-10 px-3 pt-1"><div>{dane?.opis}</div><Label klucz="9" /></div>
        </div>
    </>)
}


const emptyList: any[] = [];

export function Metryka({ znak = "XXX.1234.567.2025", tytul = "Tytuł" }: { znak: string, tytul: string }) {
    const [dane, setDane] = useState(emptyList)
    const [panding, setTransition] = useTransition()
    const [znakRwa, setZnakRwa] = useZnakRwa()
    useEffect(() => {
        var dane: any[] = []
        setTransition(async () => {
            const resp = await czynnosci(znakRwa)
            // resp.sort((a:any, b:any)=> a.pozycja - b.pozycja)
            setDane(resp)
        })
    }, [znakRwa])

    return (<Table className="border-collapse border">
        <TableHeader className="bg-sidebar"><TableHead colSpan={5}>Metryka sprawy</TableHead></TableHeader>
        <TableHeader>
            <TableHead colSpan={2} className="border">{CZYNNOSCI_META.get('1')?.label}</TableHead>
            <TableCell colSpan={3} className="border text-lg">{znak}</TableCell>
        </TableHeader>
        <TableHeader>
            <TableHead colSpan={2} className="border">{CZYNNOSCI_META.get('2')?.label}</TableHead>
            <TableCell colSpan={3} className="border text-lg">{tytul}</TableCell>
        </TableHeader>
        <TableHeader>
            <TableHead className="border w-[3em]"> L.p.</TableHead>
            <TableHead className="border w-[11em]">{CZYNNOSCI_META.get('3')?.label}</TableHead>
            <TableHead className="border">{CZYNNOSCI_META.get('4')?.label}</TableHead>
            <TableHead className="border">{CZYNNOSCI_META.get('5')?.label}</TableHead>
            <TableHead className="border">{CZYNNOSCI_META.get('6')?.label}</TableHead>
        </TableHeader>
        <TableBody>
            {!panding && <>
                {dane.map((r: any) =>
                    <TableRow>
                        <TableCell className="border"></TableCell>
                        <TableCell className="border">{r?.data_czynnosci}</TableCell>
                        <TableCell className="border"><Odpowiedzialny pracownik={r?.podejmujacy} /></TableCell>
                        <TableCell className="border">{r?.czynnosc}</TableCell>
                        <TableCell className="border">{r.znak_pisma}</TableCell>
                    </TableRow>
                )}
            </>}

        </TableBody>

    </Table>)

}

export function AktaSprawy() {
    const [dane, setDane] = useState(emptyList)
    const [panding, setTransition] = useTransition()
    const [znakRwa, setZnakRwa] = useZnakRwa()
    useEffect(() => {
        var dane: any[] = []
        setTransition(async () => {
            const resp = await akta_sprawy(znakRwa)
            resp.sort((a: any, b: any) => a.pozycja - b.pozycja)
            setDane(resp)
        })
    }, [znakRwa])


    return (
        <Table className="border-collapse">
            <TableHeader className="bg-sidebar">
                <TableHead className="border" colSpan={3}>Akta sprawy</TableHead>
            </TableHeader>
            <TableHeader>
                <TableHead className="border w-[3em]">L.p.</TableHead>
                <TableHead className="border w-[11em]">Znak kancelarii</TableHead>
                <TableHead className="border">Akta sprawy</TableHead>
            </TableHeader>
            <TableBody>
                {!panding && <>
                    {dane.map((r: any) => <>
                        <TableRow>
                            <TableCell className="border">
                                {r.pozycja}.
                            </TableCell>
                            <TableCell className="border">
                               <Link href={`/akta/${r.klucz}`} prefetch={false} target="akta">{r.klucz}</Link> 
                            </TableCell>
                            <TableCell className="w100 border p-0 border-collapse">
                                {r?.typ === 'wychodzace' && <Wychodzaca znakPisma={r.klucz} />}
                                {r?.typ === 'wplywajace' && <Wplywajaca znakPisma={r.klucz} />}
                                {r?.typ === 'akta_pozostale' && <Pozostale znakPisma={r.klucz} />}
                                <Potwierdzenia znakPisma={r.klucz}/>
                            </TableCell>
                        </TableRow>
                    </>)}
                </>}


            </TableBody>

        </Table>
    )
}

export function Label({ klucz, cn = "" }: { klucz: string; cn?: string }) {
    return (
        <span className={`text-muted-foreground ${cn} text-xs`}>
            {/* {klucz}.  */}
            {SPRAWY_META.get(klucz)?.label}
        </span>
    )
}