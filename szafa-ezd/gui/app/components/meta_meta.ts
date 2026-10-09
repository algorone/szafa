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
export const WPLYWAJACE_META = new Map([
  ['1',  { label: `Nadawca`,
           nazwa: `Oznaczenie nadawcy przesyłki, w tym:`,
           sposob_zapisu: ``,
           wymagalnosc: `` }],
  ['1a', { label: `Nazwa`,
           nazwa: `nazwa nadawcy niebędącego osobą fizyczną`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `wymagane, jeżeli nie określono 1b` }],
  ['1b', { label: `Nazwisko i imina`,
           nazwa: `nazwisko i imiona osoby fizycznej (odpowiedniki cech informacyjnych wymienionych w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)`,
           sposob_zapisu: `tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion`,
           wymagalnosc: `wymagane, jeżeli nie określono 1a` }],
  ['2',  { label: `Adres`,
           nazwa: `Adres nadawcy, o którym mowa w pkt 1, a w tym:`,
           sposob_zapisu: ``,
           wymagalnosc: `` }],
  ['2a', { label: ``,
           nazwa: `kod pocztowy`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['2b', { label: ``,
           nazwa: `miejscowość (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `wymagane` }],
  ['2c', { label: ``,
           nazwa: `ulica (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['2d', { label: ``,
           nazwa: `budynek (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['2e', { label: ``,
           nazwa: `lokal (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['2f', { label: ``,
           nazwa: `skrytka pocztowa (nr skrytki w urzędzie pocztowym)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['2g', { label: ``,
           nazwa: `kraj`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `wymagane` }],
  ['2h', { label: `e-mail `,
           nazwa: `e‑mail (adres poczty elektronicznej)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['3',  { label: `Data na piśmie`,
           nazwa: `Data widniejąca na piśmie`,
           sposob_zapisu: `data w formacie RRRR-MM-DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana`,
           wymagalnosc: `wymagane` }],
  ['4',  { label: `Data nadania`,
           nazwa: `Data nadania przesyłki`,
           sposob_zapisu: `data w formacie RRRR-MM-DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana`,
           wymagalnosc: `opcjonalne` }],
  ['5',  { label: `Data wpływu`,
           nazwa: `Data wpływu przesyłki`,
           sposob_zapisu: `data w formacie RRRR-MM-DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia`,
           wymagalnosc: `wymagane` }],
  ['6',  { label: `Data i czas rejestracji`,
           nazwa: `Data i czas wykonania rejestracji dokumentu w systemie EZD (zapisywana automatycznie)`,
           sposob_zapisu: `Data i czas w formacie RRRR-MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07-16T19:20:30`,
           wymagalnosc: `wymagane` }],
  ['7',  { label: `Rodzaj`,
           nazwa: `Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, faktura, wniosek, skarga, nota księgowa, umowa, opinia, notatka itd.)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['8',  { label: `Identyfikator`,
           nazwa: `Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu`,
           sposob_zapisu: `tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik`,
           wymagalnosc: `wymagane` }],
  ['9',  { label: `Tytuł`,
           nazwa: `Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `wymagane` }],
  ['10', { label: `Dostęp`,
           nazwa: `Dostęp - określenie dostępu`,
           sposob_zapisu: `możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny`,
           wymagalnosc: `wymagane` }],
  ['11', { label: `Liczba załączników`,
           nazwa: `Liczba załączników`,
           sposob_zapisu: `liczba naturalna`,
           wymagalnosc: `opcjonalne` }],
  ['12', { label: `Format`,
           nazwa: `Format`,
           sposob_zapisu: `tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu`,
           wymagalnosc: `wymagane dla dokumentów elektronicznych` }],
  ['13', { label: `Uwagi`,
           nazwa: `Uwagi - dodatkowe informacje dotyczące rejestrowanej przesyłki wpływającej (na przykład skan tylko 1 strona - razem ponad 500 stron, załącznik - kalendarz w formacie większym niż A3, załączona płyta CD zapisane 500 MB, załączony film na płycie DVD)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['14', { label: `Typ`,
           nazwa: `Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy`,
           sposob_zapisu: `Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony z wyrazów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text`,
           wymagalnosc: `wymagane` }],
  ['15', { label: `Sposób dostarczenia`,
           nazwa: `Sposób dostarczenia na podstawie zdefiniowanego i zatwierdzonego słownika (na przykład list zwykły, list polecony, goniec, poczta elektroniczna, elektroniczna skrzynka podawcza itd.)`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `opcjonalne` }],
  ['16', { label: `Znak u nadawcy`,
           nazwa: `Znak nadany przesyłce przez nadawcę`,
           sposob_zapisu: `tekst`,
           wymagalnosc: `wymagane, jeżeli jest` }]
]);

export const POZOSTALE_META = new Map([
  ['1', {
    label: 'Oznaczenie odpowiedzialności',
    nazwa_elementu: 'Oznaczenie odpowiedzialności za treść',
    sposób_zapisu: '',
    wymagalnosc: ''
  }],
  ['1a', {
    label: 'Imię i nazwisko',
    nazwa_elementu: 'imię nazwisko pracownika dokonującego czynności w systemie EZD (przygotowanie projektu pisma, o którym mowa w § 36 ust. 1, przygotowanie notatki, opinii, stanowiska, o których mowa w § 6 ust. 2, akceptacją pisma, o której mowa w § 16)',
    sposób_zapisu: 'tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)',
    wymagalnosc: 'wymagane'
  }],
  ['1b', {
    label: 'Stanowisko',
    nazwa_elementu: 'stanowisko pracownika dokonującego czynności w systemie, o których mowa w 1a',
    sposób_zapisu: 'tekst (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)',
    wymagalncy: 'wymagane'
  }],
  ['2', {
    label: 'Data i czas włączenia do akt',
    nazwa_elementu: 'Data i czas włączenia do akt sprawy w systemie EZD (zapisywana automatycznie)',
    sposób_zapisu: 'data i czas w formacie RRRR-MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07-16T19:20:30',
    wymagalnosc: 'wymagane'
  }],
  ['3', {
    label: 'Rodzaj dokumentu',
    nazwa_elementu: 'Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, notatka, opinia, prezentacja itd.)',
    sposób_zapisu: 'tekst',
    wymagalnosc: 'opcjonalne'
  }],
  ['4', {
    label: 'Identyfikator',
    nazwa_elementu: 'Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu',
    sposób_zapisu: 'tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik',
    wymagalnosc: 'wymagane'
  }],
  ['5', {
    label: 'Tytuł',
    nazwa_elementu: 'Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)',
    sposób_zapisu: 'tekst',
    wymagalnosc: 'wymagane'
  }],
  ['6', {
    label: 'Dostęp',
    nazwa_elementu: 'Dostęp - określenie dostępu',
    sposób_zapisu: 'możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny',
    wymagalnosc: 'wymagane'
  }],
  ['7', {
    label: 'Format',
    nazwa_elementu: 'Format',
    sposób_zapisu: 'tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu',
    wymagalnosc: 'wymagane dla dokumentów elektronicznych'
  }],
  ['8', {
    label: 'Typ',
    nazwa_elementu: 'Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej',
    sposób_zapisu: 'możliwe wartości: Collection (nieuporządkowany zbiór danych), Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony ze słów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text',
    wymagalnosc: 'wymagane'
  }]
]);

export const WYCHODZACE_META = new Map([
  ["1", {
    label: "Oznaczenie odpowiedzialności",
    nazwa: "Oznaczenie odpowiedzialności za treść przesyłki, w tym",
    "sposób_zapisu": "",
    wymagalnosc: ""
  }],
  ["1a", {
    label: "Imię i nazwisko",
    nazwa: "imię i nazwisko pracownika dokonującego czynności w systemie EZD (przygotowanie projektu pisma, o którym mowa w § 36 ust. 1, akceptacja pisma, o której mowa w § 16)",
    "sposób_zapisu": "tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)",
    wymagalnosc: "wymagane"
  }],
  ["1b", {
    label: "Stanowisko",
    nazwa: "stanowisko pracownika dokonującego czynności w systemie, o których mowa w 1a",
    "sposób_zapisu": "tekst (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)",
    wymagalnosc: "wymagane"
  }],
  ["2", {
    label: "Adresat",
    nazwa: "Oznaczenie adresata, w tym:",
    "sposób_zapisu": "",
    wymagalnosc: ""
  }],
  ["2a", {
    label: "Nazwa",
    nazwa: "nazwa adresata niebędącego osobą fizyczną",
    "sposób_zapisu": "tekst",
    wymagalnosc: "wymagane, jeżeli nie określono 2b"
  }],
  ["2b", {
    label: "Nazwisko i imię",
    nazwa: "nazwisko i imiona osoby fizycznej (odpowiedniki cech informacyjnych wymienionych w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)",
    "sposób_zapisu": "tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion",
    wymagalnosc: "wymagane, jeżeli nie określono 2a"
  }],
  ["3", {
    label: "Adres",
    nazwa: "Adres adresata, o którym mowa w pkt 1, a w tym:",
    "sposób_zapisu": "",
    wymagalnosc: ""
  }],
  ["3a", {
    label: "kod pocztowy",
    nazwa: "kod pocztowy",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3b", {
    label: "miejscowość",
    nazwa: "miejscowość (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "wymagane"
  }],
  ["3c", {
    label: "ulica",
    nazwa: "ulica (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3d", {
    label: "budynek",
    nazwa: "budynek (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3e", {
    label: "lokal",
    nazwa: "lokal (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3f", {
    label: "skrytka pocztowa",
    nazwa: "skrytka pocztowa (nr skrytki w urzędzie pocztowym)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3g", {
    label: "kraj",
    nazwa: "kraj",
    "sposób_zapisu": "tekst",
    wymagalnosc: "wymagane"
  }],
  ["3h", {
    label: "e-mail",
    nazwa: "e-mail (adres poczty elektronicznej)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["3i", {
    label: "ADE",
    nazwa: "adres doręczeń elektornicznych",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["4", {
    label: "Data na piśmie",
    nazwa: "Data widniejąca na piśmie",
    "sposób_zapisu": "data w formacie RRRR-MM-DD, gdzie RRRS to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRS albo RRRS-MM, jeżeli dokładna data nie jest znana",
    wymagalnosc: "wymagane"
  }],
  ["5", {
    label: "Data nadania",
    nazwa: "Data nadania przesyłki",
    "sposób_zapisu": "data w formacie RRRS-MM-DD, gdzie RRRS to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRS albo RRRS-MM, jeżeli dokładna data nie jest znana",
    wymagalnosc: "opcjonalne"
  }],
  ["6", {
    label: "Rodzaj",
    nazwa: "Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, faktura, wniosek, skarga, nota księgowa, umowa, opinia, notatka itd.)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["7", {
    label: "Identyfikator",
    nazwa: "Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu",
    "sposób_zapisu": "tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik",
    wymagalnosc: "wymagane"
  }],
  ["8", {
    label: "Tytuł",
    nazwa: "Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "wymagane"
  }],
  ["9", {
    label: "Dostęp",
    nazwa: "Dostęp - określenie dostępu",
    "sposób_zapisu": "możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny",
    wymagalnosc: "wymagane"
  }],
  ["10", {
    label: "Liczba załączników",
    nazwa: "Liczba załączników",
    "sposób_zapisu": "liczba naturalna",
    wymagalnosc: "opcjonalne"
  }],
  ["11", {
    label: "Format",
    nazwa: "Format",
    "sposób_zapisu": "tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu",
    wymagalnosc: "wymagane dla dokumentów elektronicznych"
  }],
  ["12", {
    label: "Uwagi",
    nazwa: "Uwagi - dodatkowe informacje dotyczące rejestrowanej przesyłki",
    "sposób_zapisu": "tekst",
    wymagalnosc: "opcjonalne"
  }],
  ["13", {
    label: "Typ",
    nazwa: "Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej",
    "sposób_zapisu": "możliwe wartości: Collection (nieuporządkowany zbiór danych), Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony z wyrazów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text",
    wymagalnosc: "wymagane"
  }],
  ["14", {
    label: "Sposób wysyłki",
    nazwa: "Sposób wysyłki na podstawie zdefiniowanego i zatwierdzonego słownika (na przykład list zwykły, list polecony, goniec, poczta elektroniczna, elektroniczna skrzynka podawcza itd.)",
    "sposób_zapisu": "tekst",
    wymagalnosc: "wymagane"
  }]
]);

export const SPRAWY_META = new Map([
  [
    '1',
    {
      label: 'Oznaczenie odpowiedzialności',
      nazwa: 'Oznaczenie odpowiedzialności za treść',
      sposob_zapisu: '',
      wymagalnosc: '',
    },
  ],
  [
    '1a',
    {
      label: 'Zakładajacy',
      nazwa: 'imię i nazwisko pracownika zakładającego sprawę',
      sposob_zapisu:
        'tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)',
      wymagalnosc: 'wymagane, jeżeli nie określono 1b',
    },
  ],
  [
    '1b',
    {
      label: 'Prowadzący',
      nazwa: 'imię i nazwisko pracownika prowadzącego sprawę',
      sposob_zapisu:
        'tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)',
      wymagalnosc: 'wymagane, jeżeli nie określono 1a',
    },
  ],
  [
    '2',
    {
      label: 'Data i czas założenia',
      nazwa: 'Data i czas założenia sprawy w systemie EZD (zapisywana automatycznie)',
      sposob_zapisu:
        'data i czas w formacie RRRR- MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07-16T19:20:30',
      wymagalnosc: 'wymagane',
    },
  ],
  [
    '3',
    {
      label: 'Data ostatniego aktu',
      nazwa: 'Data i czas ostatniego elementu akt sprawy (zapisywana automatycznie najpóźniejsza z dat spośród dat wymienionych w częściach A, B lub C załącznika)',
      sposob_zapisu:
        'data i czas w formacie RRRR- MM-DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, na przykład 1997-07-16',
      wymagalnosc: 'wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej',
    },
  ],
  [
    '4',
    {
      label: 'Znak',
      nazwa: 'Znak sprawy (zapisywany automatycznie po wybraniu właściwej pozycji wykazu akt)',
      sposob_zapisu: 'zgodnie z zasadami określonymi w instrukcji',
      wymagalnosc: 'wymagane',
    },
  ],
  [
    '5',
    {
      label: 'Tytuł',
      nazwa:
        'Tytuł - zwięzłe określenie odnoszące się do treści sprawy (na przykład przygotowanie projektu instrukcji kancelaryjnej, wyjazd do Brukseli na ..., przygotowanie umowy na wywóz nieczystości)',
      sposob_zapisu: 'tekst',
      wymagalnosc: 'wymagane',
    },
  ],
  [
    '6',
    {
      label: 'Dostęp',
      nazwa: 'Dostęp - określenie dostępu (automatyczne przyporządkowanie odpowiedniej wartości na podstawie metadanych dokumentów elektronicznych znajdujących się w aktach sprawy)',
      sposob_zapisu:
        'możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny',
      wymagalnosc:
        'wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej',
    },
  ],
  [
    '7',
    {
      label: 'Format',
      nazwa: 'Format',
      sposob_zapisu: 'ustalonawartość "Multipart/Header-Set"',
      wymagalnosc:
        'wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej',
    },
  ],
  [
    '8',
    {
      label: 'Typ',
      nazwa:
        'Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej',
      sposob_zapisu: 'ustalona wartość: Collection (nieuporządkowany zbiór danych)',
      wymagalnosc:
        'wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej',
    },
  ],
  [
    '9',
    {
      label: 'Opis',
      nazwa: 'Opis',
      sposob_zapisu: 'Tekst',
      wymagalnosc: 'opcjonalny',
    },
  ],
    [
    '10',
    {
      label: 'Klasa archiwalna',
      nazwa: 'Klasa archiwalna',
      sposob_zapisu: 'Tekst',
      wymagalnosc: 'opcjonalny',
    },
  ],
]);

export const CZYNNOSCI_META = new Map([
    ['1', {
       label:'Oznaczenie sprawy',
       opis:'Oznaczenie sprawy (data wszczęcia lub znak sprawy)'
    }],
    ['2', {
       label:'Tytuł sprawy',
       opis:'tytuł sprawy (zwięzłe określenie przedmiotu sprawy)'
    }],
    ['3',{
      label:'Data podjętej czynności',
      opis:'data dokonanej czynności'
    }],
    ['4', {
      label:'Oznaczenie osoby podejmującej daną czynność',
      opis:'Oznaczenie osoby podejmującej daną czynność; nazwisko, imię, stanowiso'     
    }],
    ['5', {
      label:'Określenie podejmowanej czynności',
      opis:'Określenie podejmowanej czynności'     
    }],
    ['6',{
      label: 'Wskazanie identyfikatora dokumentu w aktach sprawy, do którego odnosi się dana czynność',
      opis: `Wskazanie identyfikatora dokumentu w aktach sprawy, do którego odnosi się dana czynność.
      Wskazanie możliwe jest przez podanie daty dokumentu (jeżeli w sprawie jest tylko jeden dokument z określoną datą) bądź znaku pisma lub innego niepowtarzalnego w danej sprawie identyfikatora dokumentu, do którego odnosi się dana czynność. 
      Dopuszcza się dodatkowe oznaczenie dokumentów w sprawie w celu ułatwienia powiązania ich z wpisem w metryce sprawy`
    }]
])

export const NEGAT_META = new Map([
    ['1', {
       label:'Id',
       opis:'Oznaczenie negatu (data wszczęcia lub znak sprawy)'
    }],
    ['2', {
       label:'Tytuł',
       opis:'tytuł (zwięzłe określenie przedmiotu )'
    }]
])