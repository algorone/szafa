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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejesry EZD",
  description: "Hebel - rejestry EZD,  AlgorOne",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="p-10">
     
        {children}
      </main>
    </SidebarProvider>
  )
}
