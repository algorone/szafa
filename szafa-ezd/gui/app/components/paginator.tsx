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
import { usePagina } from "@/lib/pagina"
import { useRefresh } from "@/lib/refresher"
import { useTaskDispatch } from "@/lib/tasks"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"


export function Paginator() {
  const [pagina, setPagina] = usePagina()
  const [refresh, setRefresh] = useRefresh()
  const dispatch = useTaskDispatch()
 

  function wyswitl() {
    if (pagina.count == 0)
      return 'Brak danych'
    const start = (pagina.offset + 1)
    var stop = (pagina.offset + pagina.limit)
    if (stop > pagina.count) stop = pagina.count
    return '' + start + '–' + stop + ' z ' + pagina.count
  }

  function nastepna() {
    const newOffset = pagina.offset + pagina.limit
    setPagina({ ...pagina, offset: newOffset })
    setRefresh(Math.random())
    dispatch({ action: 'clear' })
  }

  function poprzednia() {
    const newOffset = pagina.offset - pagina.limit
    setPagina({ ...pagina, offset: (newOffset >= 0) ? newOffset : 0 })
    setRefresh(Math.random())
    dispatch({ action: 'clear' })
  }

  return (<>
    <span style={{ fontSize: "small", marginLeft: "auto" }}>{wyswitl()}</span>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="w-4 h-10"
          onClick={poprzednia}
          disabled={pagina.offset == 0}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Poprzednię</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Poprzednie</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="w-4 h-10"
          onClick={nastepna}
          disabled={pagina.offset + pagina.limit >= pagina.count}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Następne</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Następne</TooltipContent>
    </Tooltip>
  </>)

}