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
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Paginator } from "@/app/components/paginator";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagina } from "@/lib/pagina";
import { useRefresh } from "@/lib/refresher";
import { SearchBox2 } from "./search-box2";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SprawaKafelek } from "./sprawa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useList } from "@/lib/list";
import { Label } from "@/components/ui/label";
import { useQuery } from "@/lib/query";
import { WychodzacaKafelek } from "./wychodzaca";
import { WplywajacaKafelek } from "./wplywajaca";
import { AktaPozostaleKafelek } from "./pozostale";
import { NegatKafelek } from "./negat";
import { useKodIndeksu } from "@/lib/kod_indeksu";
import Link from "next/link";

export function Indeks(props: any) {
    return (
        <>
            <ListaKluczy />
        </>

    )
}

const emptyList: any[] = [];
const emptyObject = {};

const fetcher = (args: string | URL | Request) => fetch(args).then(res => res.json())

async function pobierzIndeks(kod: string, term?: string, offset?: number, limit?: number) {
    const url = new URL(`/ezd/api/indeksy/${kod}`, window.location.href)
    if (term)
        url.searchParams.set('term', term)
    if (offset)
        url.searchParams.set('offset', "" + offset)
    if (limit)
        url.searchParams.set('limit', "" + limit)
    const response = await fetch(url)
    const dane = await response.json()
    const count = response.headers.get('x-result-count')
    const r_limit = response.headers.get('x-requested-limit')
    const r_offset = response.headers.get('x-requested-offset')
    return { dane, count, offset: parseInt("" + r_offset), limit: parseInt("" + r_limit) }
}


export async function pobierzDane(kod: string, klucz: string) {
    const url = new URL(`/ezd/api/indeksy/${kod}/${klucz}`, window.location.href)
    const response = await fetch(url)
    const dane = await response.json()
    return dane
}

export async function agregatKlucza(kluczDane: { sprawy?: string[] | null, akta?: string[] | null, negaty?: string[] | null }) {
    const url = new URL(`/ezd/api/agregaty/klucz`, window.location.href)
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(kluczDane)
    }
    )
    const dane = await response.json()
    return dane
}

export function ListaKluczy() {
    const [panding, setTransition] = useTransition()
    const [lista, setLista] = useList()
    const [query, setQuery] = useQuery()
    const [kodIndeksu, setKodIndeksu] = useKodIndeksu()
    const [pagina, setPagina] = usePagina()
    const [refresh, setRefresh] = useRefresh()
    const [agregat, setAgregat] = useState<{ akta: any, sprawy: any, negaty: any, klucz: any, haslo: any } | null>(null)

    useEffect(() => {
        var dane: any[] = []

        setTransition(async () => {
            let kod = 'NO_INDEX'
            setAgregat(null)
            if (kodIndeksu != null && kodIndeksu !== '') {
                kod = kodIndeksu
            }
            const { dane, count, offset, limit } = await pobierzIndeks(kod, query)
            setPagina({ count: count, limit: limit, offset: offset })
            setLista(dane)
        })

    }, [refresh, kodIndeksu])


    async function pobierzPozycje(kod: string, klucz: string) {
        const kluczDane = await pobierzDane(kod, klucz)
        const agregatDane = await agregatKlucza(kluczDane)
        const agregatFull = { ...agregatDane, klucz, haslo: kluczDane.haslo }
        setAgregat(agregatFull)
    }

    return (<div className="flex h-full flex-col">
        <div className="flex items-center px-4 py-2">

            <SidebarTrigger />
            <SearchBox2 zrodlo={'index'} search={(t: any) => {
                setQuery(t)
                setRefresh(Math.random())
            }} />
            <div className="flex items-center gap-3 px-4 w-[200px]">
                <Button variant="outline">export XLS</Button>
            </div>

            <div className="flex items-center gap-3 px-4 w-[300px]">
                <Paginator />
            </div>

        </div>
        <Separator />
        <IndexBox />
        <Separator />
        <div className="grid grid-cols-[30%_70%]">
            <span>
                <ScrollArea className="h-screen">
                    <div className="py-2">
                        <Table className="border-collapse">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Klucz</TableHead>
                                    <TableHead>Hasło</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lista.map((dane: { klucz: string, haslo: string }) =>
                                    <TableRow onClick={() => pobierzPozycje(kodIndeksu, dane.klucz)} >
                                        <TableCell className="border">
                                            {dane?.klucz}
                                        </TableCell>
                                        <TableCell className="border">
                                            {dane?.haslo}
                                        </TableCell>

                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>

            </span>
            <span>


                <div className="py-2">
                    <Table className="border-collapse">
                        <TableHeader>

                            <TableRow>

                                <TableHead>
                                    <Link href={`/indeksy/${kodIndeksu}/${agregat?.klucz}`} prefetch={false} target="indeksy">
                                        Indeks {kodIndeksu}, pozycje klucza: {agregat?.klucz}
                                    </Link>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                    <ScrollArea className="h-screen">
                        <PozycjeIndeksu kodIndeksu={kodIndeksu} agregat={agregat} />
                    </ScrollArea>
                </div>

            </span>
        </div>

    </div>)
}

export function PozycjeIndeksu({ kodIndeksu, agregat }: { kodIndeksu: string | null, agregat: { akta: any, sprawy: any, negaty: any, klucz: any, haslo: any } | null }) {
    const linkRef = useRef<HTMLAnchorElement>(null);

    return (<Table className="border-collapse">
        <TableHeader>
            <TableRow style={{ "backgroundColor": "lightblue" }}>
                <TableHead>Akta</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            {(agregat !== null) && (agregat?.akta != null) && agregat.akta.map((akta: any) =>
                <>
                    <TableRow className="border" style={{ "backgroundColor": "lightcyan" }}>
                        <Link href={`/akta/${akta.znak_kancelarii}`} prefetch={false} target="akta">
                            <TableCell>{akta.znak_kancelarii}</TableCell>
                        </Link>

                    </TableRow>
                    <TableRow className="border">
                        <TableCell>
                            {(akta.adres_adresata) && <WychodzacaKafelek dane={akta} />}
                            {(akta.adres_nadawcy) && <WplywajacaKafelek dane={akta} />}
                            {(akta.data_wlaczenia) && <AktaPozostaleKafelek dane={akta} />}
                        </TableCell>
                    </TableRow>

                </>)}

        </TableBody>

        <TableHeader>
            <TableRow style={{ "backgroundColor": "lightblue" }}>
                <TableHead>Sprawy</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            {(agregat !== null) && (agregat?.sprawy != null) && agregat.sprawy.map((sprawa: any) => <>
                <TableRow >
                    <Link href={`/sprawy/${sprawa.znak}`} prefetch={false} target="sprawy">
                        <TableCell><SprawaKafelek dane={sprawa} /></TableCell>
                    </Link>
                </TableRow>
            </>)}

        </TableBody>

        <TableHeader>
            <TableRow style={{ "backgroundColor": "lightblue" }}>
                <TableHead>Negaty</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            {(agregat !== null) && (agregat?.negaty != null) && agregat.negaty.map((negat: any) => <>
                <TableRow ><Link href={`/negaty/${negat.znak}`} prefetch={false} target="negaty">
                    <TableCell><NegatKafelek dane={negat} /></TableCell>
                </Link>

                </TableRow>
            </>)}

        </TableBody>
    </Table>
    )
}

function IndexBox() {
    const [kod, setKod] = useKodIndeksu()
    return (<>
        <div className="flex items-center px-4 py-2">
            {/* <Checkbox className="px-2" id="klasyfikacje"></Checkbox> */}
            <Label htmlFor="klasyfikacje" className="px-2">
                Przeglądanie indeksu: {kod}
            </Label>
            {/* <div className="px-2">Ograniczenia do klasyfikacji jRWA: </div> */}
            <Select name="kod" value={kod} onValueChange={setKod}>
                <SelectTrigger className="w-[50%]">
                    <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="TEST">Testowy indeks gdański</SelectItem>
                    <SelectItem value="ADE">Indeksowanie po adresach doręczeń elektonicznych</SelectItem>
                    <SelectItem value="PESEL">Indeksowanie po numerze PESEL</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </>)
}



