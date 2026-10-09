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
export const dynamic = "force-dynamic";

import { cn } from "@/components/lib/utils"

import { TasksProvider, useTaskDispatch } from "@/lib/tasks"

import { ListProvider, useList } from "@/lib/list"
import { CertProvider } from "@/lib/certs"
import { useView, ViewCase, ViewProvider } from "@/lib/view"
import { RefreshProvider, useRefresh } from "@/lib/refresher"
import { PodpisProvider } from "@/lib/podpis";
import { PaginaProvider, usePagina } from "@/lib/pagina";
import { ZnakRwaProvider } from "@/lib/znakRwa";
// import { SigmaStreamProvider } from "@/lib/use-sigma-stream"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { FileStack, Folders, Home } from "lucide-react";
import { Sprawy } from "./components/sprawy";
import SprawaView from "./components/sprawaview";
import { QueryProvider } from "@/lib/query";
import { KlasyfikacjaProvider } from "@/lib/klasyfikacja";
import Link from "next/link";
import { Indeks } from "./components/indeks";
import { KodIndeksuProvider } from "@/lib/kod_indeksu";

export default function AppPage() {

  return (
    <>
      <div className="hidden flex-col md:flex">
        {/* <SigmaStreamProvider> */}
        <TasksProvider>
          <ListProvider>
            <PaginaProvider>
              <CertProvider>
                <ViewProvider>
                  <RefreshProvider>
                    <PodpisProvider>
                      <ZnakRwaProvider>
                        <QueryProvider>
                          <KlasyfikacjaProvider>
                            <KodIndeksuProvider>
                              <InnerPage />
                            </KodIndeksuProvider>
                          </KlasyfikacjaProvider>
                        </QueryProvider>
                      </ZnakRwaProvider>
                    </PodpisProvider>
                  </RefreshProvider>
                </ViewProvider>
              </CertProvider>
            </PaginaProvider>
          </ListProvider>
        </TasksProvider>
        {/* </SigmaStreamProvider> */}
      </div>
    </>
  )
}


function InnerPage() {

  const [page, setPage] = useView()
  const [refresh, setRefresh] = useRefresh()
  const [lista, setLista] = useList()
  const dispatch = useTaskDispatch()
  const [pagina, setPagina] = usePagina()


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "250px",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" >

        <SidebarContent className="flex flex-col gap-2 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild onClick={() => setPage('info')}>
                <a href="#info">
                  <div className=
                    {cn("flex aspect-square size-8 items-center justify-center rounded-lg")}>
                    <Home className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Strona główna</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>


            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild onClick={() => {
                setLista([])
                setPagina({ ...pagina, offset: 0 })
                setRefresh(Math.random())
                dispatch({ action: 'clear' })
                setPage('sprawy')
              }}>
                <a href="#sprawy">
                  <div className={cn((page === 'sprawy') ? "bg-sidebar-primary text-sidebar-primary-foreground" : "", "flex aspect-square size-8 items-center justify-center rounded-lg")}>
                    <Folders className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Sprawy</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>


            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild onClick={() => {
                setLista([])
                setPagina({ ...pagina, offset: 0 })
                setRefresh(Math.random())
                dispatch({ action: 'clear' })
                setPage('indeks')
              }}>
                <a href="#indeks">
                  <div className={cn((page === 'indeks') ? "bg-sidebar-primary text-sidebar-primary-foreground" : "", "flex aspect-square size-8 items-center justify-center rounded-lg")}>
                    <FileStack className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Indeks</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>


          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>

        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <ViewCase warunek="sprawy">
          <Sprawy />
        </ViewCase>
        <ViewCase warunek="sprawa">
          <SprawaView></SprawaView>
        </ViewCase>
        <ViewCase warunek="info">
          <Info />
        </ViewCase>
        <ViewCase warunek="indeks">
          <Indeks />
        </ViewCase>

      </SidebarInset>
    </SidebarProvider>
  )
}

function Info() {
  return (<>
    <div className="mx-auto max-w-4xl pt-10">
      <MainInfo />
      <PartnerInfo />
    </div>
  </>)

}

function MainInfo() {
  return (
    <table width="100%" cellPadding="0" border={0} summary="" className="t3ReportsRegion" id="R40652416735152382">
      <tbody><tr>
        <td valign="bottom" className=""
          style={{ "borderBottom": "1px solid #A4A471", "fontWeight": "bold", "fontSize": "large", "color": "#336699" }} >
          Szafa EZD
        </td>
        <td align="right" className="t3ButtonHolder" style={{ "borderBottom": "1px solid #A4A471" }} >
          <table align="right" summary=""><tbody><tr><td>&nbsp;</td></tr></tbody></table>
        </td>
      </tr>
        <tr className="t3instructiontext">
          <td valign="top" className="t3Body" colSpan={2} >
            <ul>
              <li> Platforma <a style={{ "textDecoration": "Underline" }} href="https://github.com/algorone" target="_blank">AlgorOne</a>, wersja 2.0  </li>
            </ul>


            <br />Instancja: {process.env.NEXT_PUBLIC_WLASCICIEL}
            <br />Opiekun robota: {process.env.NEXT_PUBLIC_OPIEKUN}
            <br />Licencja: {process.env.NEXT_PUBLIC_LICENCJA} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_LICENCJA_LINK} target="licencja"> link </a>
            <br />To oprogramowanie zawiera komponenty stron trzecich dystrybuowane na osobnych licencjach – szczegóły znajdziesz w
            <Link href='/NOTICE' target="licencja" style={{ "textDecoration": "Underline" }}> NOTICE </Link>
          </td>
        </tr>

      </tbody></table>
  )
}

function PartnerInfo() {
  return (
    <>
      <br />2026 © {process.env.NEXT_PUBLIC_PARTNER}
      <ul>
        {process.env.NEXT_PUBLIC_L0 != null && <>
          <li className="SUPPORT-L0">
            {process.env.NEXT_PUBLIC_L0} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_L0_LINK} target="support">link</a></li>
        </>}
        {process.env.NEXT_PUBLIC_L1 != null && <>
          <li className="SUPPORT-L1">
            {process.env.NEXT_PUBLIC_L1} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_L1_LINK} target="support">link</a></li>
        </>}
        {process.env.NEXT_PUBLIC_L2 != null && <>
          <li className="SUPPORT-L2">
            {process.env.NEXT_PUBLIC_L2} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_L2_LINK} target="support">link</a></li>
        </>}
        {process.env.NEXT_PUBLIC_L3 != null && <>
          <li className="SUPPORT-L3">
            {process.env.NEXT_PUBLIC_L3} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_L3_LINK} target="support">link</a></li>
        </>}
        {process.env.NEXT_PUBLIC_L4 != null && <>
          <li className="SUPPORT-L4" >
            {process.env.NEXT_PUBLIC_L4} <a style={{ "textDecoration": "Underline" }} href={process.env.NEXT_PUBLIC_L4_LINK} target="support">link</a></li>
        </>}
      </ul>
    </>
  )
}


