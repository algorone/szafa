CREATE TABLE ezd.dokumenty
(
    guid text NOT NULL,
    dane bytea,
    proxy text,
    mime text default 'application/octet-stream',
    meta json,
    uid integer,
    gid integer,
    inne integer[],
    aranzacja text[],
    utworzono timestamp without time zone NOT NULL DEFAULT now(),
    aktualizacja timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (guid)
);

CREATE TABLE ezd.poprzednie
(
    guid text NOT NULL,
    wersja integer NOT NULL default 1,
    dane bytea,
    proxy text,
    info json,
    utworzono timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (guid,  wersja)
);

