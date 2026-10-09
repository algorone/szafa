
# Szafa EZD - ewidencja spraw i akt zgodna z nomenklaturą ustawy
---
§ 27. 1. System EZD pozwala, w szczególności, na wygenerowanie spisu spraw zawierającego:

- dane odnoszące się do całego spisu spraw, co najmniej:
    1. oznaczenie roku, w którym zostały założone sprawy przyporządkowane do danej klasy z wykazu akt,
    2. datę utworzenia raportu,Dziennik Ustaw Nr 14
    3. oznaczenie komórki organizacyjnej,
    4. symbol klasyfikacyjny z wykazu akt,
    5. hasło klasyfikacyjne z wykazu akt;

- dane odnoszące się do każdej sprawy w spisie spraw, co najmniej:
    1. liczbę porządkową,
    2. kolejny numer sprawy,
    3. tytuł sprawy, stanowiący zwięzłe odniesienie się do treści sprawy,
    4. nazwę podmiotu, od którego sprawa wpłynęła, jeżeli nie jest to sprawa własna,
    5. znak nadany przesyłce wszczynającej sprawę, jeżeli nie jest to sprawa własna,
    6. datę pisma występującą na piśmie wszczynającym sprawę, jeżeli nie jest to sprawa własna,
    7. datę wszczęcia sprawy,
    8. datę ostatecznego załatwienia sprawy,
    9. imię i nazwisko prowadzącego daną sprawę,
    10. uwagi dotyczące sposobu załatwienia sprawy, jeżeli są istotne.

- System EZD umożliwia tworzenie raportów na temat założonych spraw dla:
- dowolnie wybranych okresów chronologicznych;
- dowolnie wybranej klasy z wykazu akt, niezależnie od tego, jakiego rzędu jest to klasa.


# Metadene sprawy
---

|Lp.|Label|Nazwa elementu|Sposób zapisu|Wymagalność*|Powtarzalność|
|---|---|---|---|---|---|
|1|Oznaczenie odpowiedzialności|Oznaczenie odpowiedzialności za treść| | |tak|
|1a|Zakałdajacy|imię i nazwisko pracownika zakładającego sprawę|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane, jeżeli nie określono 1b|nie|
|1b|Prowadzący|imię i nazwisko pracownika prowadzącego sprawę|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane, jeżeli nie określono 1a|tak|
|2|Data i czas założenia|Data i czas założenia sprawy w systemie EZD (zapisywana automatycznie)|data i czas w formacie RRRR- MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07- 16T19:20:30|wymagane|nie|
|3|Data ostatniego aktu|Data i czas ostatniego elementu akt sprawy (zapisywana automatycznie najpóźniejsza z dat spośród dat wymienionych w częściach A, B lub C załącznika)|data i czas w formacie RRRR- MM-DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, na przykład 1997-07-16|wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej|nie|
|4|Znak|Znak sprawy (zapisywany automatycznie po wybraniu właściwej pozycji wykazu akt)|zgodnie z zasadami określonymi w instrukcji|wymagane|nie|
|5|Tytuł|Tytuł - zwięzłe określenie odnoszące się do treści sprawy (na przykład przygotowanie projektu instrukcji kancelaryjnej, wyjazd do Brukseli na ..., przygotowanie umowy na wywóz nieczystości)|tekst|wymagane|nie|
|6|Dostęp|Dostęp - określenie dostępu (automatyczne przyporządkowanie odpowiedniej wartości na podstawie metadanych dokumentów elektronicznych znajdujących się w aktach sprawy)|możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny|wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej|nie|
|7|Format|Format|ustalonawartość "Multipart/Header-Set"|wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej|nie|
|8|Typ|Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej|ustalona wartość: Collection (nieuporządkowany zbiór danych)|wymagane w momencie eksportu danych do paczki archiwalnej, o której mowa w przepisach wydanych na podstawie art. 5 ust. 2c ustawy archiwalnej|nie|
|9|Opis|Opis|Tekst|opcjonalny|nie|

# Metadane wpływające
---

|Lp.|Label|Nazwa elementu|Sposób zapisu|Wymagalność*|Powtarzalność|
|---|---|---|---|---|---|
|1|Nadawca|Oznaczenie nadawcy przesyłki, w tym:| | |tak|
|1a|Nazwa|nazwa nadawcy niebędącego osobą fizyczną|tekst|wymagane, jeżeli nie określono 1b|nie|
|1b|Nazwisko i imina|nazwisko i imiona osoby fizycznej (odpowiedniki cech informacyjnych wymienionych w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion|wymagane, jeżeli nie określono 1a|nie|
|2|Adres|Adres nadawcy, o którym mowa w pkt 1, a w tym:| | |nie|
|2a| |kod pocztowy|tekst|opcjonalne|nie|
|2b| |miejscowość (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|wymagane|nie|
|2c| |ulica (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|2d| |budynek (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|2e| |lokal (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|2f| |skrytka pocztowa (nr skrytki w urzędzie pocztowym)|tekst|opcjonalne|nie|
|2g| |kraj|tekst|wymagane|nie|
|2h| |e-mail (adres poczty elektronicznej)|tekst|opcjonalne|tak|
|3|Data na piśmie|Data widniejąca na piśmie|data w formacie RRRR-MM- DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana|wymagane|nie|
|4|Data nadania|Data nadania przesyłki|data w formacie RRRR-MM- DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana|opcjonalne|nie|
|5|Data wpływu|Data wpływu przesyłki|data w formacie RRRR-MM- DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia|wymagane|nie|
|6|Data i czas rejestracji|Data i czas wykonania rejestracji dokumentu w systemie EZD (zapisywana automatycznie)|Data i czas w formacie RRRR- MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07- 16T19:20:30|wymagane|nie|
|7|Rodzaj|Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, faktura, wniosek, skarga, nota księgowa, umowa, opinia, notatka itd.)|tekst|opcjonalne|tak|
|8|Identyfikator|Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu|tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik|wymagane|nie|
|9|Tytuł|Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)|tekst|wymagane|nie|
|10|Dostęp|Dostęp - określenie dostępu|możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny|wymagane|nie|
|11|Liczba załączników|Liczba załączników|liczba naturalna|opcjonalne|nie|
|12|Format|Format|tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu|wymagane dla dokumentów elektronicznych|nie|
|13|Uwagi|Uwagi - dodatkowe informacje dotyczące rejestrowanej przesyłki wpływającej (na przykład skan tylko 1 strona - razem ponad 500 stron, załącznik - kalendarz w formacie większym niż A3, załączona płyta CD zapisane 500 MB, załączony film na płycie DVD)|tekst|opcjonalne|tak|
|14|Typ|Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy|Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony z wyrazów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text|wymagane|nie|
|15|Sposób dostarczenia|Sposób dostarczenia na podstawie zdefiniowanego i zatwierdzonego słownika (na przykład list zwykły, list polecony, goniec, poczta elektroniczna, elektroniczna skrzynka podawcza itd.)|tekst|opcjonalne|nie|
|16|Znak u nadawcy|Znak nadany przesyłce przez nadawcę|tekst|wymagane, jeżeli jest|nie|


# Metadane wychodzące
---

|Lp.|Label|Nazwa elementu|Sposób zapisu|Wymagalność*|Powtarzalność|
|---|---|---|---|---|---|
|1|Odpowiedzialni|Oznaczenie odpowiedzialności za treść przesyłki, w tym| | |tak|
|1a|Imię i nazwisko|imię i nazwisko pracownika dokonującego czynności w systemie EZD (przygotowanie projektu pisma, o którym mowa w § 36 ust. 1, akceptacja pisma, o której mowa w § 16)|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane|nie|
|1b|Stanowisko|stanowisko pracownika dokonującego czynności w systemie, o których mowa w 1a|tekst (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane|nie|
|2|Adresat|Oznaczenie adresata, w tym:| | |tak|
|2a|Nazwa|nazwa adresata niebędącego osobą fizyczną|tekst|wymagane, jeżeli nie określono 2b|nie|
|2b|Nazwisko i imię|nazwisko i imiona osoby fizycznej (odpowiedniki cech informacyjnych wymienionych w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion|wymagane, jeżeli nie określono 2a|nie|
|3|Adres|Adres adresata, o którym mowa w pkt 1, a w tym:| | |nie|
|3a|kod pocztowy|kod pocztowy|tekst|opcjonalne|nie|
|3b|miejscowość|miejscowość (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|wymagane|nie|
|3c|ulica|ulica (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|3d|budynek|budynek (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|3e|lokal|lokal (odpowiedniki cechy informacyjnej wymienionej w przepisach wydanych na podstawie art. 18 ustawy o informatyzacji działalności podmiotów realizujących zadania publiczne)|tekst|opcjonalne|nie|
|3f|skrytka pocztowa|skrytka pocztowa (nr skrytki w urzędzie pocztowym)|tekst|opcjonalne|nie|
|3g|kraj|kraj|tekst|wymagane|nie|
|3h|e-mail|e-mail (adres poczty elektronicznej)|tekst|opcjonalne|tak|
|4|Data na piśmie|Data widniejąca na piśmie|data w formacie RRRR-MM- DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana|wymagane|nie|
|5|Data nadania|Data nadania przesyłki|data w formacie RRRR-MM- DD, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry arabskie miesiąca, DD to dwie cyfry dnia; dopuszcza się podanie niepełnej daty, na przykład tylko RRRR albo RRRR-MM, jeżeli dokładna data nie jest znana|opcjonalne|nie|
|6|Rodzaj|Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, faktura, wniosek, skarga, nota księgowa, umowa, opinia, notatka itd.)|tekst|opcjonalne|tak|
|7|Identyfikator|Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu|tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik|wymagane|nie|
|8|Tytuł|Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)|tekst|wymagane|nie|
|9|Dostęp|Dostęp - określenie dostępu|możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny|wymagane|nie|
|10|Liczba załączników|Liczba załączników|liczba naturalna|opcjonalne|nie|
|11|Format|Format|tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu|wymagane dla dokumentów elektronicznych|nie|
|12|Uwagi|Uwagi - dodatkowe informacje dotyczące rejestrowanej przesyłki|tekst|opcjonalne|tak|
|13|Typ|Typ (wg Dublin Core Metadata Initiative. Type Vocabulary) http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej|możliwe wartości: Collection (nieuporządkowany zbiór danych), Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony z wyrazów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text|wymagane|nie|
|14|Sposób wysyłki|Sposób wysyłki na podstawie zdefiniowanego i zatwierdzonego słownika (na przykład list zwykły, list polecony, goniec, poczta elektroniczna, elektroniczna skrzynka podawcza itd.)|tekst|wymagane|nie|

# Metadane akta pozostałe
---

|Lp.|Label|Nazwa elementu|Sposób zapisu|Wymagalność*|Powtarzalność|
|---|---|---|---|---|---|
|1|Odpowiedzialni|Oznaczenie odpowiedzialności za treść| | |tak|
|1a|Imię i nazwisko|imię nazwisko pracownika dokonującego czynności w systemie EZD (przygotowanie projektu pisma, o którym mowa w § 36 ust. 1, przygotowanie notatki, opinii, stanowiska, o których mowa w § 6 ust. 2, akceptacją pisma, o której mowa w § 16)|tekst zapisany w sposób umożliwiający automatyczne rozdzielenie nazwiska i imion (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane|nie|
|1b|Stanowisko|stanowisko pracownika dokonującego czynności w systemie, o których mowa w 1a|tekst (zaleca się automatyczne wpisywanie na podstawie zidentyfikowanego w systemie EZD użytkownika)|wymagane|nie|
|2|Data i czas włączenia do akt|Data i czas włączenia do akt sprawy w systemie EZD (zapisywana automatycznie)|data i czas w formacie RRRR- MM-DDThh:mm:ss, gdzie RRRR to cztery cyfry roku, MM to dwie cyfry miesiąca, DD to dwie cyfry dnia, hh to dwie cyfry godziny, mm to dwie cyfry minut, ss to dwie cyfry sekund, na przykład 1997-07- 16T19:20:30|wymagane|nie|
|3|Rodzaj dokumentu|Oznaczenie rodzaju dokumentu na podstawie zdefiniowanego i zatwierdzonego słownika rodzajów dokumentów (na przykład pismo, notatka, opinia, prezentacja itd.)|tekst|opcjonalne|tak|
|4|Identyfikator|Nadany automatycznie unikatowy w całym systemie EZD identyfikator dokumentu|tekst bez spacji i znaków: ( ) - ukośnik lewy ( / ) - ukośnik prawy ( * ) - gwiazdka ( ? ) - znak zapytania ( : ) - dwukropek ( = ) - znak równości ( , ) - przecinek ( ; ) - średnik|wymagane|nie|
|5|Tytuł|Tytuł - zwięzłe określenie odnoszące się do treści dokumentu (na przykład sprawozdanie z przygotowań do Euro 2012, projekt instrukcji kancelaryjnej, notatka z wyjazdu do Brukseli, faktura za wywóz nieczystości)|tekst|wymagane|nie|
|6|Dostęp|Dostęp - określenie dostępu|możliwe wartości: publiczny - dostępny w całości, publiczny - dostępny częściowo, niepubliczny|wymagane|nie|
|7|Format|Format|tekst - nazwa formatu danych zastosowanego przy tworzeniu dokumentu|wymagane dla dokumentów elektronicznych|nie|
|8|Typ|Typ (wg Dublin Core Metadata Initiative. Type Vocabulary)  http://dublincore.org/documents/dcmi-type-vocabulary/ zgodnie z przepisami wynikającymi z art. 5 ust. 2a ustawy archiwalnej|możliwe wartości: Collection (nieuporządkowany zbiór danych), Dataset (uporządkowany zbiór danych), MovingImage (obraz ruchomy), PhysicalObject (obiekt fizyczny), Software (oprogramowanie), Sound (dźwięk), StillImage (obraz nieruchomy), Text (tekst) - oznacza tekst złożony ze słów przeznaczonych do czytania niezależnie od sposobu utrwalenia, w tym pismo wydrukowane na papierze, odbitkę fotograficzną tekstu, tekst zapisany zarówno w pliku rastrowym, jak i tekstowym; zaleca się wpisywanie wartości domyślnej oznaczenia typu =text|wymagane|nie|