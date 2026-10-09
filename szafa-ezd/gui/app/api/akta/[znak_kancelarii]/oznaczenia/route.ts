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
import { add_oznaczenie_akta, remove_oznaczenie_akta } from '@/app/api/actions';
import { NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ znak_kancelarii: string }> },
) {
    const znak_kancelarii = (await params).znak_kancelarii
    const oznaczenie= await request.json()
    const dane= await add_oznaczenie_akta(znak_kancelarii, oznaczenie)
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
    const searchParams = request.nextUrl.searchParams;
    const typ = searchParams?.get('typ')||'';
    const znak = searchParams?.get('znak')||'';
    const dane = await remove_oznaczenie_akta(znak_kancelarii, {typ, znak})
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

