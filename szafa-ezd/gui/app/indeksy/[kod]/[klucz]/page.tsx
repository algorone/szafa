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
import { ZnakRwaProvider } from "@/lib/znakRwa";
import { ViewProvider } from "@/lib/view";
import { Table, TableHead } from '@/components/ui/table';
import { agregatKlucza, pobierzDane, PozycjeIndeksu } from '@/app/components/indeks';

export default function IndexPozycjaPage({
    params,
}: {
    params: Promise<{ kod: string, klucz: string }>
}) {
    const { kod, klucz } = use(params)
    return (
        <ViewProvider>
            <ZnakRwaProvider>
                <IndeksPozycjaInnerPage kod={kod} klucz={klucz} />
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

function IndeksPozycjaInnerPage({
    kod, klucz
}: {
    kod: string,
    klucz: string
}) {
    const [panding, setTransition] = useTransition()

    const [agregat, setAgregat] = useState<{ akta: any, sprawy: any , negaty: any, klucz:any, haslo:any} | null>(null)

    async function pobierzPozycje(kod: string, klucz: string) {
        const kluczDane = await pobierzDane(kod, klucz)
        const agregatDane = await agregatKlucza(kluczDane)
        const agregatFull = { ...agregatDane, klucz, haslo: kluczDane.haslo }
        setAgregat(agregatFull)
    }

    useEffect(() => {
        setTransition(async () => {
            const dane = await pobierzPozycje(kod, klucz)
        })
    }, [kod, klucz])

    return (<>
        <div className="container py-10" >

            <Table>
                <TableHead>
                    <h1 style={{ "fontSize": "large" }}>Indeks {kod}</h1>
                    <h2>Poziom: pozycje klucza: {klucz}</h2>
                </TableHead>
            </Table>
            <PozycjeIndeksu kodIndeksu={kod} agregat={agregat}/>

        </div>
    </>)
}




