CREATE TYPE ezd.adres_pocztowy AS
(
	kod_pocztowy text,
	miejscowosc text,
	ulica text,
	budynek text,
	lokal text,
	skrytka text,
	kraj text
);


CREATE TYPE ezd.dostep_typ AS ENUM
    ('publiczny', 'częściowy', 'niepubliczny');

CREATE TYPE ezd.nazwa_podmiotu AS
(
	nazwa text,
	nazwisko text,
	imie text
);

CREATE TYPE ezd.pracownik AS
(
	nazwisko text,
	imie text,
	stanowisko text
);

CREATE TYPE ezd.wysylka AS
(
	nr_kancelaryjny text,
	ref_doreczyciela text,
	adresat ezd.nazwa_podmiotu[],
	adres_pocztowy ezd.adres_pocztowy,
	email text,
	ade text
);

CREATE TABLE ezd.czynnosci
(
    id serial NOT NULL,
    znak text NOT NULL,
    data_czynnosci timestamp without time zone NOT NULL,
    podejmujacy ezd.pracownik NOT NULL,
    czynnosc text NOT NULL,
    guid text NOT NULL,
    znak_pisma text,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ezd.akta_pozostale
(
    znak_kancelarii text,
    guid text,
    odpowiedzialny ezd.pracownik[],
    data_wlaczenia timestamp without time zone NOT NULL DEFAULT now(),
    rodzaj text,
    tytul text,
    dostep ezd.dostep_typ,
    format text,
    typ text,
    znak text,
    pozycja integer,
    uid integer NOT NULL DEFAULT 0,
    gid integer NOT NULL DEFAULT 0,
    inne integer[],
    wyroznik text,
    PRIMARY KEY (znak_kancelarii)
);

CREATE TABLE IF NOT EXISTS ezd.klasyfikacje
(
    id serial,
    komorka text,
    symbol text,
    grupa integer,
    rok integer,
    haslo text,
    status text,
    data_zalozenia timestamp without time zone NOT NULL DEFAULT now(),
    dostep dostep_typ,
    klasa_archiwum text,
    uid integer NOT NULL DEFAULT 0,
    gid integer NOT NULL DEFAULT 0,
    inne integer[],
    CONSTRAINT klasyfikacje_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ezd.wplywajace
(
    znak_kancelarii text NOT NULL,
    guid text NOT NULL,
    odpowiedzialny ezd.pracownik[],
    nazwa_nadawcy ezd.nazwa_podmiotu[],
    adres_nadawcy ezd.adres_pocztowy,
    email text[],
    ade text,
    data_na_pismie text,
    data_nadania text,
    data_wplywu text,
    data_rejestracji timestamp without time zone NOT NULL,
    rodzaj text,
    tytul text NOT NULL,
    dostep ezd.dostep_typ,
    liczba_zalacznikow integer,
    format text,
    uwagi text,
    typ text,
    sposob_dostarczenia text,
    znak_nadawcy text,
    znak text,
    pozycja integer,
    uid integer NOT NULL DEFAULT 0,
    gid integer NOT NULL DEFAULT 0,
    inne integer[],
    wyroznik text,
    CONSTRAINT wplywajace_pkey PRIMARY KEY (guid, znak_kancelarii)
);

CREATE TABLE IF NOT EXISTS ezd.sprawy
(
    znak text NOT NULL,
    zakladajacy ezd.pracownik,
    prowadzacy ezd.pracownik[],
    data_zalozenia timestamp without time zone NOT NULL DEFAULT now(),
    data_ostanieago_aktu timestamp without time zone,
    tytul text,
    dostep ezd.dostep_typ,
    opis text,
    nr integer,

    uid integer NOT NULL DEFAULT 0,
    gid integer NOT NULL DEFAULT 0,
    inne integer[],
    CONSTRAINT sprawy_pkey PRIMARY KEY (znak)
);

CREATE TABLE IF NOT EXISTS ezd.wychodzace
(
    znak_kancelarii text NOT NULL,
    guid text NOT NULL,
    odpowiedzialny ezd.pracownik[],
    nazwa_adresata ezd.nazwa_podmiotu[],
    adres_adresata ezd.adres_pocztowy,
    email text[],
    ade text[],
    data_na_pismie text,
    data_nadania text,
    rodzaj text,
    tytul text NOT NULL,
    dostep ezd.dostep_typ,
    liczba_zalacznikow integer,
    format text,
    uwagi text,
    typ text,
    sposob_wysylki text,
    znak_nadany text,
    znak text,
    pozycja integer,
    wysylki ezd.wysylka[],
    uid integer NOT NULL DEFAULT 0,
    gid integer NOT NULL DEFAULT 0,
    inne integer[],
    wyroznik text,
    CONSTRAINT wychodzace_pkey PRIMARY KEY (znak_kancelarii)
);

CREATE TABLE ezd.potwierdzenia
(
    id serial NOT NULL,
    znak_kancelarii text NOT NULL,
    typ text,
    opis text,
    data_operacji timestamp without time zone,
    guid text,
    PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION ezd.json_to_pracownik(
	pracownik_json json)
    RETURNS ezd.pracownik
    LANGUAGE 'sql'
    COST 10
    IMMUTABLE 
    PARALLEL SAFE
AS $BODY$
select x::ezd.pracownik 
from json_to_record(pracownik_json) 
as x(nazwisko text, imie text, stanowisko text)
$BODY$;

CREATE OR REPLACE FUNCTION ezd.json_to_pracownik_array(
	pracownik_array_json json)
    RETURNS ezd.pracownik[]
    LANGUAGE 'sql'
    COST 10
    IMMUTABLE 
    PARALLEL SAFE
AS $BODY$
  select array_agg(x ::ezd.pracownik)::ezd.pracownik[] 
  from json_to_recordset(pracownik_array_json) as x(nazwisko text, imie text, stanowisko text);
$BODY$;

CREATE OR REPLACE FUNCTION ezd.json_to_adres_pocztowy(
	adres_json json)
    RETURNS ezd.adres_pocztowy
    LANGUAGE 'sql'
    COST 10
    IMMUTABLE 
    PARALLEL SAFE
AS $BODY$
select x::ezd.adres_pocztowy 
from json_to_record(adres_json) 
as x(	kod_pocztowy text,
	miejscowosc text,
	ulica text,
	budynek text,
	lokal text,
	skrytka text,
	kraj text)
$BODY$; 

CREATE OR REPLACE FUNCTION ezd.json_to_nazwa_podmiotu(
	nazwa_json json)
    RETURNS ezd.nazwa_podmiotu
    LANGUAGE 'sql'
    COST 10
    IMMUTABLE 
    PARALLEL SAFE
AS $BODY$
select x::ezd.nazwa_podmiotu 
from json_to_record(nazwa_json) 
as x(nazwa text,
	nazwisko text,
	imie text)
$BODY$; 

CREATE OR REPLACE FUNCTION ezd.json_to_nazwa_podmiotu_array(
	nazwa_json json)
    RETURNS ezd.nazwa_podmiotu[]
    LANGUAGE 'sql'
    COST 10
    IMMUTABLE 
    PARALLEL SAFE
AS $BODY$

select array_agg(x ::ezd.nazwa_podmiotu)::ezd.nazwa_podmiotu[]
  from json_to_recordset(nazwa_json)  
as x(nazwa text,
	nazwisko text,
	imie text)
$BODY$; 

CREATE TABLE ezd.rwa
(
    rok integer,
    dane jsonb NOT NULL,
    PRIMARY KEY (rok)
);

CREATE TABLE ezd.jednostka
(
    rok integer,
    dane text NOT NULL,
    PRIMARY KEY (rok)
);

CREATE TYPE ezd.numer_sprawy AS
(
	klasyfikacja text,
	nr integer
);

CREATE OR REPLACE FUNCTION ezd.split_znak(IN znak text)
    RETURNS ezd.numer_sprawy
    LANGUAGE 'plpgsql'
    IMMUTABLE 
    PARALLEL SAFE
    COST 5
    
AS $BODY$
DECLARE
    podzial text[];
	dlugosc integer;
BEGIN
	podzial := string_to_array(znak, '.');
	dlugosc := array_length(podzial,1);
	return (array_to_string(podzial[: (dlugosc -2)]||podzial[dlugosc], '.'), (podzial[dlugosc-1])::integer)::ezd.numer_sprawy;
END;
$BODY$;

CREATE TABLE ezd.enumaracja
(
    klasyfikacja text NOT NULL,
    nr integer NOT NULL,
    PRIMARY KEY (klasyfikacja, nr)
);

CREATE INDEX znak_sprawy_idx
    ON ezd.sprawy USING btree
    ((ezd.split_znak(znak)) ASC NULLS LAST)
    INCLUDE(znak)
    WITH (deduplicate_items=True)
;

CREATE OR REPLACE FUNCTION ezd.nastepny_znak(
	p_klasyfikacja text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
nr_sprawy integer :=1;
nr_enumeracja integer;
pozycje text[];
dlugosc integer;
BEGIN
	SELECT max((ezd.split_znak(znak)).nr ) into nr_sprawy  FROM ezd.sprawy WHERE (ezd.split_znak(znak)).klasyfikacja = p_klasyfikacja;
	SELECT max(e.nr) into nr_enumeracja  FROM ezd.enumaracja e WHERE e.klasyfikacja = p_klasyfikacja;
	nr_sprawy := GREATEST(nr_sprawy, nr_enumeracja, 0) + 1;
	INSERT INTO ezd.enumaracja(klasyfikacja, nr) VALUES (p_klasyfikacja, nr_sprawy)
	ON CONFLICT (klasyfikacja, nr)
	DO UPDATE SET nr = nr_sprawy;
	pozycje := string_to_array(p_klasyfikacja, '.');
	dlugosc := array_length(pozycje,1);
	pozycje := pozycje[:dlugosc-1]||nr_sprawy::text||pozycje[dlugosc];
return array_to_string(pozycje, '.');
END
$BODY$;

CREATE TABLE ezd.negaty
(
    znak text NOT NULL,
    tytul text NOT NULL,
    opis text NOT NULL,
    uid integer,
    gid integer,
    inne integer[],
    CONSTRAINT negaty_pkey PRIMARY KEY (znak)
);


CREATE TYPE ezd.klasyfikacja AS
(
	jo text,
	rwa text,
	grupa text,
	rok character(4)
);

ALTER TYPE ezd.klasyfikacja
    OWNER TO algorone;


DROP FUNCTION ezd.split_klasyfikacja(text);
CREATE OR REPLACE FUNCTION ezd.split_klasyfikacja(
	znak text)
    RETURNS ezd.klasyfikacja
    LANGUAGE 'plpgsql'
    COST 5
    IMMUTABLE PARALLEL SAFE 
AS $BODY$
DECLARE
    podzial text[];
	dlugosc integer;
BEGIN
	podzial := string_to_array(znak, '.');
	dlugosc := array_length(podzial,1);
	return ((podzial[1]),(podzial[2]),array_to_string(podzial[3:dlugosc-2],'.'), (podzial[dlugosc]))::ezd.klasyfikacja;
END;
$BODY$;


