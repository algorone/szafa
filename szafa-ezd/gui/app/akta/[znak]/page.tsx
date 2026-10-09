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
"use client"
import { use, useEffect, useState, useTransition } from 'react'
import { useZnakRwa, ZnakRwaProvider } from "@/lib/znakRwa";
import { ViewProvider } from "@/lib/view";
import { Potwierdzenia, WychodzacaKafelek } from '@/app/components/wychodzaca';
import { WplywajacaKafelek } from '@/app/components/wplywajaca';
import { AktaPozostaleKafelek } from '@/app/components/pozostale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function AktaPage({
    params,
}: {
    params: Promise<{ znak: string }>
}) {
    const { znak } = use(params)
    return (
        <ViewProvider>
            <ZnakRwaProvider>
                <AktaInnerPage znak={znak} />
            </ZnakRwaProvider>
        </ViewProvider>)
}

async function pobierzAkta(znak: string) {
    const url = new URL(`/ezd/api/akta/${znak}`, window.location.href)
    const response = await fetch(url)
    if (response.ok) {
        const dane = await response.json()
        return dane
    }
    return null

}

function AktaInnerPage({
    znak,
}: {
    znak: string
}) {
    const [panding, setTransition] = useTransition()
    const [znakRwa, setZnak] = useZnakRwa()
    const [akta, setAkta] = useState<any>(null)
    useEffect(() => {
        setTransition(async () => {
            const dane = await pobierzAkta(znak)
            setAkta(dane)
        })
        setZnak(znak)
    }, [znak])

    return (<>
        <div className="container py-10" >

            <Table>
                <TableHead>
                    <h1 style={{ "fontSize": "large" }}>Rzeczowy Wykaz Akt</h1>
                    <h2>Poziom: Akta</h2>
                </TableHead>
            </Table>
            {akta !== null && <>
                <Table className="border-collapse">

                    <TableHeader>

                        <TableHead className="border w-[11em]">Znak kancelarii</TableHead>
                        <TableHead className="border">Akta</TableHead>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border">
                                {znakRwa}
                            </TableCell>
                            <TableCell className="w100 border p-0 border-collapse">
                                {(akta.adres_adresata) && <WychodzacaKafelek dane={akta} />}
                                {(akta.adres_nadawcy) && <WplywajacaKafelek dane={akta} />}
                                {(akta.data_wlaczenia) && <AktaPozostaleKafelek dane={akta} />}
                                <Potwierdzenia znakPisma={znak} />
                                <AktaPowiazania sprawy={akta.sprawy} negaty={akta.negaty}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </>}
        </div>
    </>)
}

function AktaPowiazania({ sprawy, negaty }: { sprawy: string[] | null, negaty: string[] | null }) {
    return (
        <>
            <Table className="border-collapse border w100 text-xs">
                <TableHeader>
                    <TableHead className="border text-xs bg-sidebar p-2" colSpan={2}>Powiązania</TableHead>
                </TableHeader>

                <TableBody className="text-sm">
                    <TableRow>
                        <TableHead className="border p-2 text-xs">Sprawy</TableHead>
                        <TableCell>  {(sprawy != null) && sprawy.map((s: any) => <><Link href={"/sprawy/" + s} target="sprawa" prefetch={false} > <span>{s}</span></Link></>)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="border p-2 text-xs">Negaty</TableHead>
                        <TableCell>  {(negaty != null) && negaty.map((s: any) => <><Link href={"/negaty/" + s} target="negaty" prefetch={false} > <span>{s}</span></Link></>)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}



