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
interface LdapEntry {
  dn: string;
  objectClass: string[];
  attributes: Record<string, string[]>;
}

class LdifUtils {
  parse(ldifContent: string): LdapEntry[] {
    const entries: LdapEntry[] = [];
    let currentEntry: LdapEntry | null = null;

    // Podziel na linie i obsłuż kontynuację
    const lines = this.processContinuationLines(ldifContent.split('\n'));

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      if (trimmedLine.startsWith('dn:')) {
        if (currentEntry) {
          entries.push(currentEntry);
        }

        currentEntry = {
          dn: this.extractValue(trimmedLine),
          objectClass: [],
          attributes: {}
        };
        continue;
      }

      if (currentEntry && trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const attrName = trimmedLine.substring(0,
          colonIndex).trim().toLowerCase();
        const attrValue = trimmedLine.substring(colonIndex + 1).trim();

        if (attrName === 'objectclass') {
          currentEntry.objectClass.push(attrValue);
        } else {
          if (!currentEntry.attributes[attrName]) {
            currentEntry.attributes[attrName] = [];
          }
          currentEntry.attributes[attrName].push(attrValue);
        }
      }
    }

    if (currentEntry) {
      entries.push(currentEntry);
    }

    return entries;
  }

  private processContinuationLines(lines: string[]): string[] {
    const processedLines: string[] = [];
    let currentLine = '';

    for (const line of lines) {
      if (line.trim().startsWith(' ')) {
        // Linia kontynuacji
        currentLine += line.trim();
      } else {
        if (currentLine) {
          processedLines.push(currentLine);
        }
        currentLine = line;
      }
    }

    if (currentLine) {
      processedLines.push(currentLine);
    }

    return processedLines;
  }

  private extractValue(line: string): string {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      return line.substring(colonIndex + 1).trim();
    }
    return line;
  }
}

const ldif= new LdifUtils()

export type { LdapEntry }
export {ldif}