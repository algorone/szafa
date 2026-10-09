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
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { headers } from 'next/headers'

import { promises as fs } from 'fs';

export default async function OpenApiPage(){
    
    let file = await fs.readFile(process.cwd() + '/public/openapi.yaml', 'utf8');
    const host = (await headers()).get('Host')
    file = file.replaceAll('HOST_NAME', host||'unknown')

    return(<>
        <SwaggerUI spec={file} />
    </>

)
}