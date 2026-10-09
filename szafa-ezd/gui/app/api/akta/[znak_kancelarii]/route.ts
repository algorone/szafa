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
import { akta, delete_akta, insert_akta_pozostaele, insert_wplywajaca, insert_wychodzaca } from '@/app/api/actions';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ znak_kancelarii: string }> },
) {
    const znak = (await params).znak_kancelarii
    const dane = await akta(znak)
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ znak_kancelarii: string }> },
) {
    const znak_kancelarii = (await params).znak_kancelarii
    const akta = await request.json()
    if(znak_kancelarii !== akta?.znak_kancelarii){
        console.log('Niezgodnosc znaku kancelarii ' + znak_kancelarii + ' vs ' + akta?.znak_kancelarii)
        return Response.error()
    }
       
    if(akta.nazwa_nadawcy != null){
        console.log('Próbujemy jako wplywajaca')
        const ret= await insert_wplywajaca(akta)  
    } else if(akta.nazwa_adresata != null){
        console.log('Próbujemy jako akta wychodzaca')
        const ret= await insert_wychodzaca(akta)  
    } else {
        console.log('Próbujemy jako akta pozostale')
        const ret= await insert_akta_pozostaele(akta)
    }
    const dane = { status: 'OK', znak_kancelarii: znak_kancelarii}
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ znak_kancelarii: string }> },
) {
    const znak_kancelarii = (await params).znak_kancelarii
    const dane = await delete_akta(znak_kancelarii)
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

