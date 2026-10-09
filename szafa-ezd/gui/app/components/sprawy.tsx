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
import React, { useEffect, useTransition } from "react";
import { useView } from "@/lib/view";
import { useZnakRwa } from "@/lib/znakRwa";
import { sprawy } from "../actions";
import { Paginator } from "@/app/components/paginator";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagina } from "@/lib/pagina";
import { useRefresh } from "@/lib/refresher";
import { SearchBox2 } from "./search-box2";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SPRAWY_META } from "./meta_meta";
import { Odpowiedzialni, Odpowiedzialny } from "./common";
import { useList } from "@/lib/list";
import { useQuery } from "@/lib/query";
import { useKlasyfikacja } from "@/lib/klasyfikacja";
import { KlasyfikacjaBox } from "./klasyfikacja-box";

export function Sprawy(props: any) {
    return (
        <>
            <ListaSpraw />
        </>

    )
}

const emptyList: any[] = [];
const emptyObject = {};


export function ListaSpraw() {

    const [panding, setTransition] = useTransition()

    const [lista, setLista] = useList()
    const [klasyfikacja, setKlasyfikacja] = useKlasyfikacja()
    const [page, setPage] = useView()
    const [query, setQuery] = useQuery()
    const [znakRwa, setZnakRwa] = useZnakRwa()
    const [pagina, setPagina] = usePagina()
    const [refresh, setRefresh] = useRefresh()

    useEffect(() => {
        var dane: any[] = []

        setTransition(async () => {
            let myQuery = query
            if(klasyfikacja!=null){
                const [glownaCzesc, podaneHaslo] = klasyfikacja.split('#')
                if (glownaCzesc && glownaCzesc!=='...')
                    myQuery = query + " klasyfikacja:"+glownaCzesc
            }
            
            const resp = await sprawy(myQuery.trim(), pagina.limit, pagina.offset)
            const dane = resp.dane
            setPagina({ count: resp.count, limit: resp.limit, offset: resp.offset })
            setLista(dane)
        })

    }, [znakRwa, refresh])


    return (<div className="flex h-full flex-col">
        <div className="flex items-center px-4 py-2">

            <SidebarTrigger />
            <SearchBox2 zrodlo={'sprawy'} search={(t: any) => {
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
                 <KlasyfikacjaBox/>
        <Separator />
        <ScrollArea className="h-screen">
            <div className="py-2">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow>
                            <THLabelSprawy klucz="4" />
                            <THLabelSprawy klucz="5" />
                            <THLabelSprawy klucz="1a" />
                            <THLabelSprawy klucz="1b" />
                            <THLabelSprawy klucz="2" />
                            <THLabelSprawy klucz="3" />
                            <THLabelSprawy klucz="9" />
                            <THLabelSprawy klucz="10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lista.map((dane: { znak: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; tytul: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; zakladajacy: any; prowadzacy: any; data_zalozenia: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; data_ostanieago_aktu: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; opis: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; klasa_archiwum: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) =>
                            <TableRow onClick={() => {
                                setZnakRwa(dane.znak)
                                setPage('sprawa')
                            }} >
                                <TableCell className="border">
                                    {dane?.znak}
                                </TableCell>
                                <TableCell className="border">
                                    {dane?.tytul}
                                </TableCell>
                                <TableCell className="border">
                                    <Odpowiedzialny pracownik={dane?.zakladajacy} />
                                </TableCell>
                                <TableCell className="border">
                                    <Odpowiedzialni pracownicy={dane?.prowadzacy} />
                                </TableCell>
                                <TableCell className="border">
                                    {dane?.data_zalozenia}
                                </TableCell>
                                <TableCell className="border">
                                    {dane?.data_ostanieago_aktu}
                                </TableCell>
                                <TableCell className="border">
                                    {dane?.opis}
                                </TableCell>
                                <TableCell className="border">
                                    {dane?.klasa_archiwum}
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
    </div>)
}

function THLabelSprawy({ klucz }: { klucz: string }) {
    return <TableHead> {SPRAWY_META.get(klucz)?.label}</TableHead>
}

