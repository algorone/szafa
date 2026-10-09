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
import { delete_sprawa, insert_sprawa } from '@/app/api/actions';
import { sprawa } from '@/app/actions';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ znak: string }> },
) {
    const znak = (await params).znak
    const dane = await sprawa(znak)
    return new Response(JSON.stringify(dane), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request: Request,
        { params }: { params: Promise<{ znak: string }> },
) {
    const znak = (await params).znak
    const sprawa = await request.json()
    if(znak !== sprawa?.znak)
       return Response.error() 
    const ret = await insert_sprawa(sprawa);
    return Response.json({ ret })
}

export async function DELETE(request: Request,
        { params }: { params: Promise<{ znak: string }> },
) {
    const znak = (await params).znak
    const ret = await delete_sprawa(znak);
    return Response.json({ ret })
}