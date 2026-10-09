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
import { wplywajaca } from "../actions";
import { WPLYWAJACE_META } from "./meta_meta";
import { IdentyfikatorDokumentu } from "./wychodzaca";

const emptyObject = {};

export function Wplywajaca(props: any) {
    const znakPisma = props?.znakPisma;
    const [dane, setDane] = useState<any>(emptyObject);
    const [panding, setTransition] = useTransition();

    useEffect(() => {
        setTransition(async () => {
            const resp = await wplywajaca(znakPisma);
            setDane(resp);
        });
    }, [znakPisma]);

    return (
        <>
            {panding && <>ładuję ...</>}
            {!panding && WplywajacaKafelek({ dane })}
        </>
    );
}

export function WplywajacaKafelek({ dane }: any) {

    return (
        <>
            <div className="grid grid-cols-12">
<div className="border-b col-span-3"><NadawcaNazwa nazwa={dane?.nazwa_nadawcy} /><Label klucz="1" /></div>
<div className="border-b border-x col-span-5"><AdresPocztowy adres={dane?.adres_nadawcy} /> <Label klucz="2" /></div>
<div className="border-b border-r col-span-2"> <AdresEmail mail={dane?.email} /> <Label klucz="2h" />        </div>
<div className="border-b col-span-2"> <AdreaDoreczenElekronicznych ade={dane?.ade} /> <Label klucz="2i" /></div>
<div className="border-b col-span-3"> <DataNaPismie data_na_pismie={dane?.data_na_pismie} /> <Label klucz="3" /></div>
<div className="border-b border-x col-span-3"> <DataNadania data_nadania={dane?.data_nadania} /> <Label klucz="4" /></div>
<div className="border-b border-r col-span-3"> <DataWplywu data_wplywu={dane?.data_wplywu} /> <Label klucz="5" /></div>
<div className="border-b col-span-3"> <DataRejestracji data_rejestracji={dane?.data_rejestracji} /> <Label klucz="6" /></div>
<div className="border-b col-span-4"></div>
<div className="border-b border-x col-span-2"> <OznaczenieRodzaju oznaczenie_rodzaju={dane?.rodzaj} /> <Label klucz="7" /></div>
<div className="border-b col-span-6"> <IdentyfikatorDokumentu guid={dane?.guid} /> <Label klucz="8" /></div>
<div className="border-b col-span-8"> <Tytul tytul={dane?.tytul} /> <Label klucz="9" /></div>
<div className="border-b border-x col-span-1"> <Dostep dostep={dane?.dostep} /> <Label klucz="10" /></div>
<div className="border-b border-r col-span-2"> <LiczbaZalacznikow liczba_zalacznikow={dane?.liczba_zalacznikow} /> <Label klucz="11" /></div>
<div className="border-b col-span-1"> <Format format={dane?.format} /> <Label klucz="12" /></div>
<div className="border-r col-span-8"> <Uwagi uwagi={dane?.uwagi} /> <Label klucz="13" /></div>
<div className="boredrex"> <Typ typ={dane?.typ} /> <Label klucz="14" /></div>
<div className="border-x"> <SposobDostarczenia sposob_dostarczenia={dane?.sposob_dostarczenia} /> <Label klucz="15" /></div>
<div className="borderex col-span-2"> <ZnakNadawcy znak_nadawcy={dane?.znak_nadawcy} /> <Label klucz="16" /></div>
            </div>
        </>
    );
}

export function ZnakNadawcy({ znak_nadawcy }: any) {
    return <span>{znak_nadawcy}</span>;
}

export function SposobDostarczenia({ sposob_dostarczenia }: any) {
    return <span>{sposob_dostarczenia}</span>;
}

export function Typ({ typ }: any) {
    return <span className="blocks">{typ}</span>;
}

export function Uwagi({ uwagi }: any) {
    return <span>{uwagi}</span>;
}

export function Format({ format }: any) {
    return <span>{format}</span>;
}

export function LiczbaZalacznikow({ liczba_zalacznikow }: any) {
    return <span>{liczba_zalacznikow}</span>;
}

export function Dostep({ dostep }: any) {
    return <span>{dostep}</span>;
}

export function Tytul({ tytul }: any) {
    return <span className="font-semibold block">{tytul}</span>;
}



export function OznaczenieRodzaju({ oznaczenie_rodzaju }: any) {
    return <span>{oznaczenie_rodzaju}</span>;
}

export function DataRejestracji({ data_rejestracji }: any) {
    return <span className="block">{data_rejestracji}</span>;
}

export function DataWplywu({ data_wplywu }: any) {
    return <span className="block">{data_wplywu}</span>;
}

export function DataNadania({ data_nadania }: any) {
    return <span className="block">{data_nadania}</span>;
}

export function DataNaPismie({ data_na_pismie }: any) {
    return <span className="block">{data_na_pismie}</span>;
}

export function AdreaDoreczenElekronicznych({ ade }: any) {
    return <span>{ade}</span>;
}

export function AdresEmail({ mail }: any) {
    return (
        <span className="flex gap-1">
            {Array.isArray(mail) &&
mail.map((mailItem: any, idx: any) => (
 <span key={idx}>{mailItem}</span>
))}
        </span>
    );
}

export function AdresPocztowy({ adres }: any) {
    return (
        <span className="flex gap-1">
            <span>{adres?.kod_pocztowy}</span>
            <span>{adres?.miejscowosc}</span>
            <span>{adres?.ulica}</span>
            <span>{adres?.budynek}</span>
            <span>{adres?.lokal}</span>
            <span>{adres?.skrytka}</span>
            <span>{adres?.kraj}</span>
        </span>
    );
}

export function NadawcaNazwa({ nazwa }: any) {
    return (
        <span>
            {Array.isArray(nazwa) &&
nazwa.map((adresat: any, idx: any) => (
 <span key={idx} className="flex gap-1">
     <span>{adresat.imie}</span>
     <span>{adresat.nazwisko}</span>
     <span>{adresat.nazwa}</span>
 </span>
))}
        </span>
    );
}

export function Label({ klucz, cn = "" }: { klucz: string; cn?: string }) {
    return (
        <span className={`text-muted-foreground ${cn}  text-xs`}>
            {/* {klucz}. */}
             {WPLYWAJACE_META.get(klucz)?.label}
        </span>
    );
}