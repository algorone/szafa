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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { useKlasyfikacja } from "@/lib/klasyfikacja";
import { useRefresh } from "@/lib/refresher";
import { getJoList, getLataList } from "../actions";


export function KlasyfikacjaBox(){

    const [panding, setTransition] = useTransition()
    const [jo,setJo]= useState('')
    const [rwa,setRwa] = useState('')
    const [grupa, setGrupa] =useState('')
    const [rok, setRok] =useState('')
    const [haslo, setHaslo] =useState('')
    const [klasyfikacja, setKlasysfikacja] = useKlasyfikacja()
    const [refresh, setRefresh] = useRefresh()
    const [joList, setJoList] = useState<any>(null)
    const [lataList, setLataList] = useState<any>(null)

    useEffect(()=>{
        setTransition(async ()=>{
            const dane = await getJoList()
            setJoList(dane)
            const dane2 = await getLataList()
            setLataList(dane2)
        })
    },[])
    

    useEffect(()=>{
        if (!klasyfikacja || typeof klasyfikacja !== 'string') return
        const [glownaCzesc, podaneHaslo] = klasyfikacja.split('#')
        const [podaneJo, podaneRwa, podanaGrupa, podanyRok] = glownaCzesc.split('.')
        setJo(podaneJo || '')
        setRwa(podaneRwa || '')
        setGrupa(podanaGrupa || '')
        setRok(podanyRok || '')
        setHaslo(podaneHaslo || '')
    },[klasyfikacja])

    function ustaw(){
        setKlasysfikacja(""+jo+"."+rwa+"."+grupa+"."+rok+"#"+haslo)
        setRefresh(Math.random())
    }

    function reset(){
        setJo('')
        setRwa('')
        setGrupa('')
        setRok('')
        setHaslo('')
        setKlasysfikacja('')
        setRefresh(Math.random())
    }
    
    return(
                <div className="flex items-center px-4 py-2">
 
                    <Label htmlFor="klasyfikacje" className="px-2">
                        Ogranicz sprawy do klasyfikacji RWA:
                    </Label>

                    <Select name="jo" value={jo} onValueChange={setJo}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                            {(joList!=null)&&joList.map((kod:any)=>
                               <SelectItem value={kod.jo}>{kod.jo}</SelectItem>
                            )}

                        </SelectContent>
                    </Select>
                    <div className="px-2"> . </div>
                    <div className="w-[100px] relative">
                        <Input placeholder="kod RWA" value={rwa} onChange={(e)=>setRwa(e.target.value)}/>
                    </div>
        
                    <div className="px-2"> . </div>
                    <div className="w-[100px] relative">
                        <Input placeholder="grupa"  value={grupa} onChange={(e)=>setGrupa(e.target.value)}/>
                    </div>
                    <div className="px-2"> . </div>
                    <Select name="rok" value={rok} onValueChange={setRok}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                            {(lataList!=null)&&lataList.map((kod:any)=>
                               <SelectItem value={kod.rok}>{kod.rok}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <div className="px-4"> hasło: </div>
                    <div className="w-[300px] relative">
        
                        <Input placeholder="hasło"  value={haslo} onChange={(e)=>setHaslo(e.target.value)} disabled={true}/>
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-accent hover:text-accent-foreground p-2">
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline" onClick={ustaw}><Check/></Button>
                    <Button variant="outline" onClick={reset}><X/></Button>
                </div>
    )

}