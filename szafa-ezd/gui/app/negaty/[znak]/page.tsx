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
import { Metryka } from "../../components/sprawa";
import { ViewProvider } from "@/lib/view";
import { AktaNegatu, NegatKafelek } from '@/app/components/negat';
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table';

export default function SprawaPage({
    params,
}: {
    params: Promise<{ znak: string }>
}) {
    const { znak } = use(params)
    return (
        <ViewProvider>
            <ZnakRwaProvider>
                <NegatInnerPage znak={znak} />
            </ZnakRwaProvider>
        </ViewProvider>)
}

async function pobierzNegat(znak: string) {
    const url = new URL(`/ezd/api/negaty/${znak}`, window.location.href)
    const response = await fetch(url)
    if (response.ok) {
        const dane = await response.json()
        return dane
    }
    return null

}


function NegatInnerPage({
    znak,
}: {
    znak: string
}) {
    const [panding, setTransition] = useTransition()
    const [znakRwa, setZnak] = useZnakRwa()
    const [negat, setNegat] = useState<any>()
    useEffect(() => {
        setTransition(async () => {
            const dane = await pobierzNegat(znak)
            setNegat(dane)
        })
        setZnak(znak)
    }, [znak])

    return (<>
        <div className="container py-10" >

            <Table>
                <TableHead>
                    <h1 style={{ "fontSize": "large" }}>Dokumtacja spoza RWA</h1>
                    <h2>Poziom: Negat</h2>
                </TableHead>

            </Table>
            <Table >
                <TableRow>
                    <TableCell className="border">
                        <NegatKafelek dane={negat} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="border">
                        <Metryka znak="NEGAT" tytul={negat?.tytul} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="border">
                        <AktaNegatu />
                    </TableCell>
                </TableRow>
            </Table>

        </div>
    </>)
}



