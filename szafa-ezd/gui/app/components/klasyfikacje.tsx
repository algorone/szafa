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
import { ColumnDef } from "@tanstack/react-table"
import { useView } from "@/lib/view";
import { useZnakRwa } from "@/lib/znakRwa";
import { klasyfikacja, klasyfikacja_pozycje, klasyfikacje_latami } from "../actions";
import { Paginator } from "@/app/components/paginator";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { DataTable } from "@/app/components/data-table"
import { usePagina } from "@/lib/pagina";
import { useRefresh } from "@/lib/refresher";
import { SearchBox2 } from "./search-box2";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Klasyfikacje() {
    return (
        <>
            <KlasyfikacjeLista />
        </>

    )
}

const emptyList: any[] = [];
const emptyObject = {};

export function KlasyfikacjeLista() {

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "komorka",
            header: "Komórka",
        },

        {
            accessorKey: "symbol",
            header: "Symbol",
        },
        {
            accessorKey: "grupa",
            header: "Grupa",
        },
        {
            accessorKey: "lata",
            header: "Lata",
            cell: ({ row }) => {
                const lata: [] = row.getValue("lata")
                return <>{lata.map((rok: any, idx: number) =>
                    <a key={idx}
                        onClick={() => {
                            setQuery(rok.znak)
                            setDisplay('spisSpraw')
                        }
                        }
                        href={"#" + rok.znak}
                        className="text-right font-medium underline">{rok.rok}{(idx < lata.length - 1) && <>,</>}</a>
                )}
                </>
            }
        },
        {
            accessorKey: "haslo",
            header: "Hasło",
        }
    ]


    const [panding, setTransition] = useTransition()

    const [lista, setLista] = useState(emptyList)
    const [display, setDisplay] = useView()
    const [query, setQuery] = useZnakRwa()
    const [pagina, setPagina] = usePagina()
    const [refresh, setRefresh] = useRefresh()

    useEffect(() => {

        setTransition(async () => {
            const resp = await klasyfikacje_latami(query, pagina.limit, pagina.offset)
            const dane = resp.dane
            setPagina({ count: resp.count, limit: resp.limit, offset: resp.offset })
            setLista(dane)
        })

    }, [query, refresh])

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center px-4 py-2">
              <SidebarTrigger />
                <SearchBox2 zrodlo={'klasyfikacje'} search={(t: any) => setQuery(t)} />
                <div className="flex items-center gap-3 px-4 w-[300px]">
                    <Paginator />
                </div>
            </div>
            <Separator />
            <ScrollArea className="h-screen">

                <div className="container py-10">

                    <Table>
                        <TableHead>
                            <h1 style={{ "fontSize": "large" }}>Rzeczowy Wykaz Akt</h1>
                            <h2>Poziom: klasyfikacje</h2>
                        </TableHead>
                    </Table>

                    <DataTable columns={columns} data={lista} />

                </div>
            </ScrollArea>


        </div>
    )
}

export function SpisSprawRwa() {

  const sprawaColumns: ColumnDef<any>[] = [
    {
      accessorKey: "nr",
      header: "L.P.",
    },
    {
      accessorKey: "znak",
      header: "Znak",
      cell: ({ row }) => {
        return <a href="#" onClick={() => {
          if (row.original.typ === 'sprawa') {
            setZnakRwa(row.getValue("znak"))
            setPage('sprawa')
          } else {
            setZnakRwa(row.getValue("znak"))
          }

        }}
          className="text-right font-medium underline">{row.getValue("znak")}</a>

      }
    },
    {
      accessorKey: "tytul",
      header: "Tytuł",
      cell: ({ row }) => {
        const tytul = row.getValue("tytul")
        const typ = row.original?.typ
        return <><span className="font-semibold">{(typ === 'grupa') && <>GRUPA SPRAW</>} </span>{tytul}</>
      }
    },
    {
      accessorKey: "zakladajacy",
      header: "Pracownik zakładajacy",
    },
    {
      accessorKey: "prowadzacy",
      header: "Pracownik prowadzący",
    },
    {
      accessorKey: "data_zalozenia",
      header: "Data założenia",
    },
    {
      accessorKey: "data_ostanieago_aktu",
      header: "Data ostaniego aktu",
    }
  ]

  const [panding, setTransition] = useTransition()
  const [guid, setGuid] = useState()
  const [pagina, setPagina] = usePagina()

  const [kwalifikacja, setKwalifikacja] = useState<any>()

  const [sprawy, setSprawy] = useState(emptyList)
  const [display, setPage] = useView()
  const [znakRwa, setZnakRwa] = useZnakRwa()
  const [refresh, setRefresh] = useRefresh()

  useEffect(() => {
    setTransition(async () => {
      if (znakRwa) {
        const resp = await klasyfikacja_pozycje(znakRwa, pagina.offset, pagina.limit)
        setSprawy(resp?.dane)
        setPagina({ count: resp.count, limit: resp.limit, offset: resp.offset })
        const kwalifikacjaRow = (await klasyfikacja(znakRwa))
        setKwalifikacja(kwalifikacjaRow)
      }
    })
  }, [znakRwa,refresh])

  return (
    <div className="flex h-full flex-col">
      {/* <div className="flex items-center px-4 py-2">
        <span style={{ width: '100%' }}/>

      </div>
      <Separator /> */}

      <ScrollArea className="h-screen">

        <div className="container py-10" >
          <Table>
            <TableHead>
              <h1 style={{ "fontSize": "large" }}>Rzeczowy Wykaz Akt</h1>
              <h2>Poziom: spis spraw
                {/* {(znakRwa && znakRwa.startsWith("hg_id:"))?" - grupa":""} */}
              </h2>
            </TableHead>
            <TableHead  >
              <div className="flex justify-end w-full"> 
                 <div className="flex items-center gap-3 w-[300px]">
          <Paginator />
        </div>
              </div>
                     
            </TableHead>
          </Table>
          <Table className="border">

            <TableRow>
              <TableCell className="border">{kwalifikacja?.komorka}<div className="text-muted-foreground">Komórka</div></TableCell>
              <TableCell className="border">{kwalifikacja?.symbol}
                <div className="text-muted-foreground">Symbol</div>
              </TableCell>
              {(kwalifikacja?.grupa != null) &&
                <TableCell className="border">{kwalifikacja?.grupa}<div className="text-muted-foreground">Grupa</div></TableCell>}
              <TableCell className="border">{kwalifikacja?.rok}
                <div className="text-muted-foreground">Rok</div>
              </TableCell>
              <TableCell className="border">{kwalifikacja?.haslo}
                <div className="text-muted-foreground">Hasło</div>
              </TableCell>
              <TableCell className="border">{kwalifikacja?.klasa_archiwum}
                <div className="text-muted-foreground">Klasa archiwalna</div>
              </TableCell>

            </TableRow>
          </Table>
          <DataTable columns={sprawaColumns} data={sprawy} />
        </div>
      </ScrollArea>
    </div>)
}