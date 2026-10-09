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

import { NextRequest } from 'next/server';
import { upsert_so , so} from '../actions';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ rok: number }> },
) {
    const rok = (await params).rok
    const dane = await so(rok)
    return new Response(dane, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
    });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ rok: number }> },
) {
    const rok = (await params).rok
    const dane = await request.text()
    const res = await upsert_so(rok,dane)
    return new Response(JSON.stringify(res), {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
    });
}
