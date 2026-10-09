CREATE TABLE ezd.indeksy
(
    kod text NOT NULL,
    klucz text NOT NULL,
    haslo text,
    sprawy text[],
    akta text[], 
    negaty text[], 
    uid integer,
    gid integer,
    inne integer[],
    data_utworzenia timestamp without time zone NOT NULL DEFAULT now(),
    data_aktualizacji timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (kod,klucz)
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_indeksy_wyszukiwanie_trgm 
ON ezd.indeksy USING gin (klucz gin_trgm_ops, haslo gin_trgm_ops);
