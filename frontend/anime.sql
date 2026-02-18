--
-- PostgreSQL database dump
--

\restrict CgcCMVbaaeUiz8sBH1nhiaIZZ7jNRIwcxfHUBpzYRYZbL1cpziVZdS09mWcN99j

-- Dumped from database version 18.1 (Homebrew)
-- Dumped by pg_dump version 18.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: caps; Type: TABLE; Schema: public; Owner: elgatoaa
--

CREATE TABLE public.caps (
    id integer NOT NULL,
    serie_id integer NOT NULL,
    img character varying(100),
    url character varying(100) NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public.caps OWNER TO elgatoaa;

--
-- Name: caps_id_seq; Type: SEQUENCE; Schema: public; Owner: elgatoaa
--

CREATE SEQUENCE public.caps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.caps_id_seq OWNER TO elgatoaa;

--
-- Name: caps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elgatoaa
--

ALTER SEQUENCE public.caps_id_seq OWNED BY public.caps.id;


--
-- Name: generos; Type: TABLE; Schema: public; Owner: elgatoaa
--

CREATE TABLE public.generos (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.generos OWNER TO elgatoaa;

--
-- Name: generos_id_seq; Type: SEQUENCE; Schema: public; Owner: elgatoaa
--

CREATE SEQUENCE public.generos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.generos_id_seq OWNER TO elgatoaa;

--
-- Name: generos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elgatoaa
--

ALTER SEQUENCE public.generos_id_seq OWNED BY public.generos.id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: elgatoaa
--

CREATE TABLE public.series (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    year integer NOT NULL,
    description text,
    img character varying(100) NOT NULL
);


ALTER TABLE public.series OWNER TO elgatoaa;

--
-- Name: series_generos; Type: TABLE; Schema: public; Owner: elgatoaa
--

CREATE TABLE public.series_generos (
    serie_id integer NOT NULL,
    genero_id integer NOT NULL
);


ALTER TABLE public.series_generos OWNER TO elgatoaa;

--
-- Name: series_id_seq; Type: SEQUENCE; Schema: public; Owner: elgatoaa
--

CREATE SEQUENCE public.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.series_id_seq OWNER TO elgatoaa;

--
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elgatoaa
--

ALTER SEQUENCE public.series_id_seq OWNED BY public.series.id;


--
-- Name: caps id; Type: DEFAULT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.caps ALTER COLUMN id SET DEFAULT nextval('public.caps_id_seq'::regclass);


--
-- Name: generos id; Type: DEFAULT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.generos ALTER COLUMN id SET DEFAULT nextval('public.generos_id_seq'::regclass);


--
-- Name: series id; Type: DEFAULT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);


--
-- Data for Name: caps; Type: TABLE DATA; Schema: public; Owner: elgatoaa
--

COPY public.caps (id, serie_id, img, url, number) FROM stdin;
1	1	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
4	2	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
7	3	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
10	4	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
13	5	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
16	6	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
19	7	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
22	9	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
25	10	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
28	12	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
31	13	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
33	14	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
35	15	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
37	16	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
39	17	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
41	18	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
43	19	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
45	20	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	1
2	1	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
5	2	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
8	3	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
11	4	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
14	5	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
17	6	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
20	8	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
23	9	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
26	11	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
29	12	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
32	14	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
34	15	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
36	16	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
38	17	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
40	18	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
42	19	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
44	20	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	2
3	1	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
6	2	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
9	3	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
12	4	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
15	5	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
18	7	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
21	8	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
24	10	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
27	11	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
30	13	dev.png	https://www.yourupload.com/embed/EQSBDuW2I6XI	3
\.


--
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: elgatoaa
--

COPY public.generos (id, nombre) FROM stdin;
1	Acción
2	Aventura
3	Ciencia Ficción
4	Suspenso
5	Drama
6	Misterio
7	Psicológico
8	Post-apocalíptico
9	Cyberpunk
10	Mecha
\.


--
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: elgatoaa
--

COPY public.series (id, name, year, description, img) FROM stdin;
1	Shoujo Shuumatsu Ryokou	2017	Dos chicas recorren un mundo postapocalíptico explorando ciudades abandonadas.	dev.png
2	Made in Abyss	2017	Una niña desciende a un abismo lleno de criaturas extrañas y misterios antiguos.	dev.png
3	Steins;Gate	2011	Un grupo de amigos descubre cómo enviar mensajes al pasado y altera la línea temporal.	dev.png
4	Ergo Proxy	2006	En una ciudad futurista, humanos y androides conviven bajo un sistema autoritario.	dev.png
5	Serial Experiments Lain	1998	Una adolescente se adentra en una red virtual que afecta la realidad.	dev.png
6	Psycho-Pass	2012	Un sistema mide la criminalidad potencial de las personas antes de cometer delitos.	dev.png
7	Paranoia Agent	2004	Una serie de ataques conecta las vidas de varias personas en Tokio.	dev.png
8	Texhnolyze	2003	Una ciudad subterránea vive en decadencia mientras facciones luchan por el poder.	dev.png
9	Akira	1988	Un experimento militar desata poderes psíquicos incontrolables en Neo-Tokyo.	dev.png
10	Ghost in the Shell	1995	Una cyborg persigue a un hacker capaz de manipular mentes humanas.	dev.png
11	Neon Genesis Evangelion	1995	Adolescentes pilotean mechas para enfrentar entidades conocidas como Ángeles.	dev.png
12	Cowboy Bebop	1998	Un grupo de cazarrecompensas viaja por el espacio enfrentando su pasado.	dev.png
13	Death Parade	2015	Personas fallecidas son sometidas a juegos que determinan su destino final.	dev.png
14	Monster	2004	Un cirujano persigue a un asesino serial al que salvó cuando era niño.	dev.png
15	Vinland Saga	2019	Un joven guerrero busca venganza en la era vikinga.	dev.png
16	Dororo	2019	Un samurái sin extremidades recupera partes de su cuerpo derrotando demonios.	dev.png
17	Berserk	1997	Un mercenario marcado por la tragedia lucha contra fuerzas demoníacas.	dev.png
18	Claymore	2007	Guerreras mitad humanas enfrentan monstruos llamados Yoma.	dev.png
19	Another	2012	Una maldición acecha a una clase escolar causando muertes misteriosas.	dev.png
20	Dorohedoro	2020	Un hombre con cabeza de reptil busca recuperar su identidad en un mundo caótico.	dev.png
\.


--
-- Data for Name: series_generos; Type: TABLE DATA; Schema: public; Owner: elgatoaa
--

COPY public.series_generos (serie_id, genero_id) FROM stdin;
1	2
1	8
2	2
2	6
3	3
3	4
4	3
4	9
5	7
5	9
6	3
6	4
7	7
7	6
8	9
8	5
9	3
9	1
10	3
10	9
10	1
\.


--
-- Name: caps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: elgatoaa
--

SELECT pg_catalog.setval('public.caps_id_seq', 45, true);


--
-- Name: generos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: elgatoaa
--

SELECT pg_catalog.setval('public.generos_id_seq', 10, true);


--
-- Name: series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: elgatoaa
--

SELECT pg_catalog.setval('public.series_id_seq', 20, true);


--
-- Name: caps caps_pkey; Type: CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.caps
    ADD CONSTRAINT caps_pkey PRIMARY KEY (id);


--
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: caps caps_serie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.caps
    ADD CONSTRAINT caps_serie_id_fkey FOREIGN KEY (serie_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: series_generos series_generos_genero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.series_generos
    ADD CONSTRAINT series_generos_genero_id_fkey FOREIGN KEY (genero_id) REFERENCES public.generos(id) ON DELETE CASCADE;


--
-- Name: series_generos series_generos_serie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: elgatoaa
--

ALTER TABLE ONLY public.series_generos
    ADD CONSTRAINT series_generos_serie_id_fkey FOREIGN KEY (serie_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict CgcCMVbaaeUiz8sBH1nhiaIZZ7jNRIwcxfHUBpzYRYZbL1cpziVZdS09mWcN99j

