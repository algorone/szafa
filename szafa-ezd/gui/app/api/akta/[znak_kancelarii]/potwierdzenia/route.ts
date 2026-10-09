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
import { insert_potwierdzenie, potwierdzenia } from '@/app/api/actions';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ znak_kancelarii: string}> },
) {
    const param = (await params)
    const dane = await potwierdzenia(param.znak_kancelarii)
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
    const potwierdzenie = await request.json()
    const dane= await insert_potwierdzenie(potwierdzenie)
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

}
