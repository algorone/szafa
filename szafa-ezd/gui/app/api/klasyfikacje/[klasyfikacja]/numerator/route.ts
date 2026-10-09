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
import { nastepny_znak } from '@/app/api/actions';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ klasyfikacja: string }> },
) {
    const ref = (await params).klasyfikacja;
    const resp = await  nastepny_znak(ref)

    return new Response(JSON.stringify(resp.znak), {
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
    });
}

