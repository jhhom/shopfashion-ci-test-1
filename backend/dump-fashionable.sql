--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_line_item_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_line_item_status AS ENUM (
    'PROCESSING',
    'TO_SHIP',
    'TO_RECEIVE',
    'COMPLETED'
);


ALTER TYPE public.order_line_item_status OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING_PAYMENT',
    'PAID',
    'CANCELLED'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: product_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_status AS ENUM (
    'ACTIVE',
    'ARCHIVED',
    'OUT_OF_STOCK'
);


ALTER TYPE public.product_status OWNER TO postgres;

--
-- Name: product_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_type AS ENUM (
    'SIMPLE',
    'CONFIGURABLE'
);


ALTER TYPE public.product_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: customer_cart_configurable_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_cart_configurable_items (
    customer_id integer NOT NULL,
    product_variant_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    added_at timestamp without time zone NOT NULL
);


ALTER TABLE public.customer_cart_configurable_items OWNER TO postgres;

--
-- Name: customer_cart_simple_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_cart_simple_items (
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    added_at timestamp without time zone NOT NULL
);


ALTER TABLE public.customer_cart_simple_items OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: order_line_configurable_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_configurable_items (
    order_id integer NOT NULL,
    product_variant_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    order_line_item_status public.order_line_item_status DEFAULT 'PROCESSING'::public.order_line_item_status NOT NULL
);


ALTER TABLE public.order_line_configurable_items OWNER TO postgres;

--
-- Name: order_line_simple_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_simple_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    order_line_item_status public.order_line_item_status DEFAULT 'PROCESSING'::public.order_line_item_status NOT NULL
);


ALTER TABLE public.order_line_simple_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    shipping_fee numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    order_status public.order_status DEFAULT 'PENDING_PAYMENT'::public.order_status NOT NULL,
    delivery_address jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_association_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_association_types (
    id integer NOT NULL,
    type_name text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_association_types OWNER TO postgres;

--
-- Name: product_association_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_association_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_association_types_id_seq OWNER TO postgres;

--
-- Name: product_association_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_association_types_id_seq OWNED BY public.product_association_types.id;


--
-- Name: product_associations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_associations (
    product_association_type_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.product_associations OWNER TO postgres;

--
-- Name: product_configurable_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_configurable_options (
    id integer NOT NULL,
    product_id integer NOT NULL,
    product_option_code character varying(255) NOT NULL
);


ALTER TABLE public.product_configurable_options OWNER TO postgres;

--
-- Name: product_configurable_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_configurable_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_configurable_options_id_seq OWNER TO postgres;

--
-- Name: product_configurable_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_configurable_options_id_seq OWNED BY public.product_configurable_options.id;


--
-- Name: product_option_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option_values (
    id integer NOT NULL,
    option_code character varying(255) NOT NULL,
    option_value text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_option_values OWNER TO postgres;

--
-- Name: product_option_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_option_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_option_values_id_seq OWNER TO postgres;

--
-- Name: product_option_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_option_values_id_seq OWNED BY public.product_option_values.id;


--
-- Name: product_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_options (
    code character varying(255) NOT NULL,
    option_name text NOT NULL,
    "position" integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_options OWNER TO postgres;

--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_reviews (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    comment text DEFAULT ''::text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_reviews OWNER TO postgres;

--
-- Name: product_taxons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_taxons (
    id integer NOT NULL,
    product_id integer NOT NULL,
    taxon_id integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_taxons OWNER TO postgres;

--
-- Name: product_taxons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_taxons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_taxons_id_seq OWNER TO postgres;

--
-- Name: product_taxons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_taxons_id_seq OWNED BY public.product_taxons.id;


--
-- Name: product_variant_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_options (
    id integer NOT NULL,
    product_variant_id integer NOT NULL,
    product_option_value_id integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_variant_options OWNER TO postgres;

--
-- Name: product_variant_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variant_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_variant_options_id_seq OWNER TO postgres;

--
-- Name: product_variant_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variant_options_id_seq OWNED BY public.product_variant_options.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    pricing numeric(10,2) DEFAULT 0.00 NOT NULL,
    variant_name text NOT NULL,
    product_id integer NOT NULL,
    "position" integer NOT NULL,
    product_status public.product_status DEFAULT 'ACTIVE'::public.product_status NOT NULL,
    product_variant_image_url text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    pricing numeric(10,2) DEFAULT 0.00 NOT NULL,
    product_name text NOT NULL,
    product_description text DEFAULT ''::text NOT NULL,
    product_type public.product_type DEFAULT 'SIMPLE'::public.product_type NOT NULL,
    taxon_id integer NOT NULL,
    product_status public.product_status DEFAULT 'ACTIVE'::public.product_status NOT NULL,
    product_image_url text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: taxons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taxons (
    id integer NOT NULL,
    parent_id integer,
    taxon_name text NOT NULL,
    slug text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.taxons OWNER TO postgres;

--
-- Name: taxons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taxons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.taxons_id_seq OWNER TO postgres;

--
-- Name: taxons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taxons_id_seq OWNED BY public.taxons.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_association_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_association_types ALTER COLUMN id SET DEFAULT nextval('public.product_association_types_id_seq'::regclass);


--
-- Name: product_configurable_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_configurable_options ALTER COLUMN id SET DEFAULT nextval('public.product_configurable_options_id_seq'::regclass);


--
-- Name: product_option_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_values ALTER COLUMN id SET DEFAULT nextval('public.product_option_values_id_seq'::regclass);


--
-- Name: product_taxons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_taxons ALTER COLUMN id SET DEFAULT nextval('public.product_taxons_id_seq'::regclass);


--
-- Name: product_variant_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_options ALTER COLUMN id SET DEFAULT nextval('public.product_variant_options_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: taxons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxons ALTER COLUMN id SET DEFAULT nextval('public.taxons_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, password, username, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: customer_cart_configurable_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_cart_configurable_items (customer_id, product_variant_id, quantity, added_at) FROM stdin;
\.


--
-- Data for Name: customer_cart_simple_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_cart_simple_items (customer_id, product_id, quantity, added_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, email, password, updated_at, created_at) FROM stdin;
1	james@email.com	james123	2024-01-14 12:03:49.463404	2024-01-14 12:03:49.463404
2	graham@email.com	graham123	2024-01-14 12:03:49.463906	2024-01-14 12:03:49.463906
3	ellis@email.com	ellis123	2024-01-14 12:03:49.464316	2024-01-14 12:03:49.464316
4	edith@email.com	edith123	2024-01-14 12:03:49.464568	2024-01-14 12:03:49.464568
5	jack@email.com	jack123	2024-01-14 12:03:49.464837	2024-01-14 12:03:49.464837
6	willow@email.com	willow123	2024-01-14 12:03:49.46508	2024-01-14 12:03:49.46508
7	sawyer@email.com	sawyer123	2024-01-14 12:03:49.465395	2024-01-14 12:03:49.465395
8	george@email.com	george123	2024-01-14 12:03:49.46569	2024-01-14 12:03:49.46569
9	william@email.com	william123	2024-01-14 12:03:49.466013	2024-01-14 12:03:49.466013
10	hudson@email.com	hudson123	2024-01-14 12:03:49.466376	2024-01-14 12:03:49.466376
11	nash@email.com	nash123	2024-01-14 12:03:49.466675	2024-01-14 12:03:49.466675
12	ralph@email.com	ralph123	2024-01-14 12:03:49.466989	2024-01-14 12:03:49.466989
13	cole@email.com	cole123	2024-01-14 12:03:49.467291	2024-01-14 12:03:49.467291
14	julian@email.com	julian123	2024-01-14 12:03:49.467579	2024-01-14 12:03:49.467579
15	hayden@email.com	hayden123	2024-01-14 12:03:49.467845	2024-01-14 12:03:49.467845
16	lewis@email.com	lewis123	2024-01-14 12:03:49.468099	2024-01-14 12:03:49.468099
17	alfred@email.com	alfred123	2024-01-14 12:03:49.468357	2024-01-14 12:03:49.468357
18	charlie@email.com	charlie123	2024-01-14 12:03:49.468673	2024-01-14 12:03:49.468673
19	parker@email.com	parker123	2024-01-14 12:03:49.468964	2024-01-14 12:03:49.468964
20	mason@email.com	mason123	2024-01-14 12:03:49.469223	2024-01-14 12:03:49.469223
21	hugh@email.com	hugh123	2024-01-14 12:03:49.469486	2024-01-14 12:03:49.469486
22	arden@email.com	arden123	2024-01-14 12:03:49.469737	2024-01-14 12:03:49.469737
23	benett@email.com	benett123	2024-01-14 12:03:49.470019	2024-01-14 12:03:49.470019
24	lucy@email.com	lucy123	2024-01-14 12:03:49.470264	2024-01-14 12:03:49.470264
25	mary@email.com	mary123	2024-01-14 12:03:49.470518	2024-01-14 12:03:49.470518
26	daisy@email.com	daisy123	2024-01-14 12:03:49.470759	2024-01-14 12:03:49.470759
27	olive@email.com	olive123	2024-01-14 12:03:49.471004	2024-01-14 12:03:49.471004
28	lily@email.com	lily123	2024-01-14 12:03:49.471251	2024-01-14 12:03:49.471251
29	hazel@email.com	hazel123	2024-01-14 12:03:49.471477	2024-01-14 12:03:49.471477
30	everett@email.com	everett123	2024-01-14 12:03:49.471716	2024-01-14 12:03:49.471716
31	scarlet@email.com	scarlet123	2024-01-14 12:03:49.471964	2024-01-14 12:03:49.471964
32	jane@email.com	jane123	2024-01-14 12:03:49.472228	2024-01-14 12:03:49.472228
33	evelyn@email.com	evelyn123	2024-01-14 12:03:49.472469	2024-01-14 12:03:49.472469
34	etta@email.com	etta123	2024-01-14 12:03:49.472783	2024-01-14 12:03:49.472783
35	annie@email.com	annie123	2024-01-14 12:03:49.473115	2024-01-14 12:03:49.473115
36	faith@email.com	faith123	2024-01-14 12:03:49.473368	2024-01-14 12:03:49.473368
37	rosie@email.com	rosie123	2024-01-14 12:03:49.473664	2024-01-14 12:03:49.473664
38	everly@email.com	everly123	2024-01-14 12:03:49.473893	2024-01-14 12:03:49.473893
39	maggie@email.com	maggie123	2024-01-14 12:03:49.474119	2024-01-14 12:03:49.474119
40	sunny@email.com	sunny123	2024-01-14 12:03:49.474351	2024-01-14 12:03:49.474351
41	jenna@email.com	jenna123	2024-01-14 12:03:49.474643	2024-01-14 12:03:49.474643
42	kate@email.com	kate123	2024-01-14 12:03:49.474881	2024-01-14 12:03:49.474881
43	may@email.com	may123	2024-01-14 12:03:49.475114	2024-01-14 12:03:49.475114
44	henrietta@email.com	henrietta123	2024-01-14 12:03:49.475353	2024-01-14 12:03:49.475353
\.


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20230926084939_create_admins_table.cjs	1	2024-01-14 12:03:40.154+08
2	20231002075134_create_products_table.cjs	1	2024-01-14 12:03:40.182+08
3	20231017010518_create_customers_table.cjs	1	2024-01-14 12:03:40.186+08
4	20231021131954_create_orders_table.cjs	1	2024-01-14 12:03:40.189+08
5	20231023024334_create_product_reviews_table.cjs	1	2024-01-14 12:03:40.191+08
6	20231023133603_create_product_associations_table.cjs	1	2024-01-14 12:03:40.193+08
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: order_line_configurable_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_configurable_items (order_id, product_variant_id, quantity, unit_price, order_line_item_status) FROM stdin;
1	82	2	38.80	COMPLETED
2	67	1	72.80	COMPLETED
2	98	1	56.60	COMPLETED
2	30	1	40.30	COMPLETED
2	14	1	32.00	COMPLETED
3	61	4	15.00	COMPLETED
4	136	1	38.70	COMPLETED
4	124	1	28.90	COMPLETED
4	159	1	62.20	COMPLETED
5	113	2	65.60	COMPLETED
5	149	3	53.50	COMPLETED
6	38	2	26.40	COMPLETED
7	152	1	120.50	COMPLETED
7	149	2	53.50	COMPLETED
7	112	1	68.60	COMPLETED
7	116	1	68.60	COMPLETED
8	108	1	46.60	COMPLETED
9	82	2	38.80	COMPLETED
10	42	2	37.80	COMPLETED
11	82	2	38.80	COMPLETED
11	15	3	32.00	COMPLETED
12	67	1	72.80	COMPLETED
12	98	1	56.60	COMPLETED
12	30	1	40.30	COMPLETED
12	14	1	32.00	COMPLETED
13	61	4	15.00	COMPLETED
14	136	1	38.70	COMPLETED
14	124	1	28.90	COMPLETED
14	159	1	62.20	COMPLETED
15	113	2	65.60	COMPLETED
15	149	3	53.50	COMPLETED
16	38	2	26.40	COMPLETED
17	152	1	120.50	COMPLETED
17	149	2	53.50	COMPLETED
17	112	1	68.60	COMPLETED
17	116	1	68.60	COMPLETED
18	108	1	46.60	COMPLETED
19	82	2	38.80	COMPLETED
20	42	2	37.80	COMPLETED
21	131	2	29.50	COMPLETED
22	67	1	72.80	COMPLETED
22	30	1	40.30	COMPLETED
22	14	1	32.00	COMPLETED
23	139	2	38.70	COMPLETED
23	180	2	68.70	COMPLETED
24	57	2	32.00	COMPLETED
24	159	1	62.20	COMPLETED
25	108	1	46.60	COMPLETED
25	120	1	53.80	COMPLETED
25	149	3	53.50	COMPLETED
26	38	2	26.40	COMPLETED
27	152	1	120.50	COMPLETED
28	120	1	53.80	COMPLETED
29	82	2	38.80	COMPLETED
30	42	2	37.80	COMPLETED
31	82	2	38.80	COMPLETED
31	15	3	32.00	COMPLETED
32	143	1	43.30	COMPLETED
32	109	1	46.60	COMPLETED
33	61	4	15.00	COMPLETED
34	67	1	72.80	COMPLETED
34	14	1	32.00	COMPLETED
35	113	2	65.60	COMPLETED
35	149	3	53.50	COMPLETED
36	38	2	26.40	COMPLETED
37	152	1	120.50	COMPLETED
37	127	1	28.90	COMPLETED
37	116	1	68.60	COMPLETED
38	108	1	46.60	COMPLETED
39	82	2	38.80	COMPLETED
40	42	2	37.80	COMPLETED
41	3	2	28.90	COMPLETED
41	27	3	36.70	COMPLETED
42	30	1	40.30	COMPLETED
43	60	2	15.00	COMPLETED
44	136	1	38.70	COMPLETED
44	177	1	68.70	COMPLETED
45	113	2	65.60	COMPLETED
45	149	3	53.50	COMPLETED
46	38	2	26.40	COMPLETED
47	152	1	120.50	COMPLETED
47	116	1	68.60	COMPLETED
48	108	1	46.60	COMPLETED
49	4	1	28.90	COMPLETED
50	145	2	51.50	COMPLETED
51	82	1	38.80	COMPLETED
51	6	1	28.90	COMPLETED
52	67	1	72.80	COMPLETED
52	14	1	32.00	COMPLETED
53	58	2	32.00	COMPLETED
54	46	1	31.50	COMPLETED
54	43	2	35.30	COMPLETED
55	113	2	65.60	COMPLETED
55	149	1	53.50	COMPLETED
56	38	2	26.40	COMPLETED
57	152	1	120.50	COMPLETED
57	116	1	68.60	COMPLETED
58	108	1	46.60	COMPLETED
59	82	2	38.80	COMPLETED
60	42	2	37.80	COMPLETED
61	2	2	28.90	COMPLETED
61	15	3	32.00	COMPLETED
62	67	1	72.80	COMPLETED
62	98	1	56.60	COMPLETED
63	179	3	68.70	COMPLETED
64	136	1	38.70	COMPLETED
64	139	1	38.70	COMPLETED
65	120	2	53.80	COMPLETED
65	112	1	68.60	COMPLETED
66	127	3	28.90	COMPLETED
67	152	1	120.50	COMPLETED
67	116	1	68.60	COMPLETED
68	108	3	46.60	COMPLETED
69	82	2	38.80	COMPLETED
70	42	1	37.80	COMPLETED
71	82	1	38.80	COMPLETED
71	15	1	32.00	COMPLETED
72	40	3	22.50	COMPLETED
73	59	2	32.00	COMPLETED
74	139	1	38.70	COMPLETED
74	136	1	38.70	COMPLETED
75	113	2	65.60	COMPLETED
75	149	3	53.50	COMPLETED
76	38	2	26.40	COMPLETED
77	152	1	120.50	COMPLETED
77	149	2	53.50	COMPLETED
77	112	3	68.60	COMPLETED
78	108	1	46.60	COMPLETED
79	82	2	38.80	COMPLETED
80	42	2	37.80	COMPLETED
81	15	1	32.00	COMPLETED
82	67	1	72.80	COMPLETED
82	98	1	56.60	COMPLETED
82	30	1	40.30	COMPLETED
82	14	1	32.00	COMPLETED
83	61	4	15.00	COMPLETED
84	124	1	28.90	COMPLETED
84	127	1	28.90	COMPLETED
85	113	2	65.60	COMPLETED
85	149	3	53.50	COMPLETED
86	40	1	22.50	COMPLETED
86	36	1	22.50	COMPLETED
87	152	1	120.50	COMPLETED
87	149	2	53.50	COMPLETED
87	112	1	68.60	COMPLETED
87	116	1	68.60	COMPLETED
88	108	1	46.60	COMPLETED
89	142	1	43.30	COMPLETED
89	114	1	65.60	COMPLETED
90	41	4	35.30	COMPLETED
90	74	1	59.90	COMPLETED
91	127	1	28.90	COMPLETED
92	67	1	72.80	COMPLETED
92	98	1	56.60	COMPLETED
92	54	1	20.00	COMPLETED
92	50	1	20.00	COMPLETED
93	61	4	15.00	COMPLETED
94	124	1	28.90	COMPLETED
94	126	2	26.70	COMPLETED
95	113	2	65.60	COMPLETED
95	149	3	53.50	COMPLETED
96	38	1	26.40	COMPLETED
97	152	1	120.50	COMPLETED
97	116	1	68.60	COMPLETED
98	82	1	38.80	COMPLETED
98	15	1	32.00	COMPLETED
99	67	1	72.80	COMPLETED
99	14	1	32.00	COMPLETED
100	152	1	120.50	COMPLETED
100	116	2	68.60	COMPLETED
101	108	1	46.60	COMPLETED
102	82	3	38.80	COMPLETED
103	85	1	38.80	COMPLETED
103	89	1	37.80	COMPLETED
104	35	1	22.50	COMPLETED
104	39	1	22.50	COMPLETED
104	85	1	38.80	COMPLETED
105	58	2	32.00	COMPLETED
105	38	2	26.40	COMPLETED
106	104	1	46.60	COMPLETED
107	113	2	65.60	COMPLETED
108	82	2	38.80	COMPLETED
1	15	3	32.00	TO_RECEIVE
\.


--
-- Data for Name: order_line_simple_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_simple_items (order_id, product_id, quantity, unit_price, order_line_item_status) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_id, shipping_fee, total_price, order_status, delivery_address, created_at) FROM stdin;
1	1	20.00	173.60	PAID	{"city": "Port Alexandria", "state": "Kentucky", "address1": "Suite 559", "address2": "2905 Smith Camp", "fullName": "James Edison", "postalCode": "77222", "mobilePhone": "+60696245058"}	2024-01-13 23:26:45.674
2	7	20.00	201.70	PAID	{"city": "Lake Willybury", "state": "Louisiana", "address1": "Suite 693", "address2": "2694 Markus Park", "fullName": "Tom Sawyer", "postalCode": "36554", "mobilePhone": "+60896819070"}	2024-01-12 20:35:28.373
3	4	20.00	60.00	PAID	{"city": "Detroit", "state": "South Dakota", "address1": "Apt. 821", "address2": "300 Auer Mount", "fullName": "Edith Bob", "postalCode": "81698", "mobilePhone": "+60324997201"}	2024-01-11 03:08:05.656
4	26	20.00	129.80	PAID	{"city": "Yoshikotown", "state": "Hawaii", "address1": "Suite 731", "address2": "98098 Eliza Light", "fullName": "Daisy Ridley", "postalCode": "40224", "mobilePhone": "+60830987579"}	2024-01-08 03:38:09.013
5	25	20.00	291.70	PAID	{"city": "South San Francisco", "state": "Oklahoma", "address1": "Suite 942", "address2": "908 Sipes Crest", "fullName": "Mary Lowe", "postalCode": "85849", "mobilePhone": "+60036595337"}	2024-01-07 03:33:47.087
6	17	20.00	52.80	PAID	{"city": "O'Connerland", "state": "Idaho", "address1": "Apt. 265", "address2": "396 Dariana Avenue", "fullName": "Alfred Albert", "postalCode": "67038", "mobilePhone": "+60396321704"}	2024-01-05 18:58:30.899
7	33	20.00	364.70	PAID	{"city": "East Frieda", "state": "Mississippi", "address1": "Apt. 739", "address2": "29474 Citlalli Cliff", "fullName": "Evelyn Charlotte", "postalCode": "20424", "mobilePhone": "+60420042418"}	2024-01-04 08:03:36.78
8	35	20.00	46.60	PAID	{"city": "Port Gerard", "state": "Indiana", "address1": "Apt. 569", "address2": "8890 Orrin Route", "fullName": "Annie Sophia", "postalCode": "02398", "mobilePhone": "+60339654515"}	2024-01-04 12:40:26.499
9	17	20.00	77.60	PAID	{"city": "Hilpertstad", "state": "Delaware", "address1": "Suite 157", "address2": "74069 Lauriane Underpass", "fullName": "Alfred Albert", "postalCode": "69062", "mobilePhone": "+60564873047"}	2024-01-03 13:03:03.382
10	13	20.00	75.60	PAID	{"city": "Wehnerboro", "state": "Arizona", "address1": "Suite 558", "address2": "7367 Berge Corners", "fullName": "Cole Nick", "postalCode": "53557", "mobilePhone": "+60339937521"}	2023-12-31 20:20:37.238
11	2	20.00	173.60	PAID	{"city": "Goldabury", "state": "Wisconsin", "address1": "Apt. 196", "address2": "7439 Abbott Court", "fullName": "Graham Smith", "postalCode": "00021", "mobilePhone": "+60559837767"}	2023-12-30 02:17:56.619
12	6	20.00	201.70	PAID	{"city": "Fort Halie", "state": "Minnesota", "address1": "Suite 162", "address2": "301 Augustine Loop", "fullName": "Willow Wilson", "postalCode": "79456", "mobilePhone": "+60149698402"}	2023-12-28 17:03:46.815
13	9	20.00	60.00	PAID	{"city": "Sierra Vista", "state": "Nevada", "address1": "Apt. 985", "address2": "2768 Amely Rest", "fullName": "William Smith", "postalCode": "37071", "mobilePhone": "+60049083548"}	2023-12-28 07:15:56.273
14	34	20.00	129.80	PAID	{"city": "Logan", "state": "Missouri", "address1": "Apt. 204", "address2": "365 Wolf Camp", "fullName": "Etta Amelia", "postalCode": "13830", "mobilePhone": "+60281489481"}	2023-12-24 08:14:06.508
15	38	20.00	291.70	PAID	{"city": "West Zaria", "state": "Arkansas", "address1": "Apt. 986", "address2": "66598 Isabella Circle", "fullName": "Everly Luna", "postalCode": "62687", "mobilePhone": "+60573147810"}	2023-12-23 13:25:15.961
16	12	20.00	52.80	PAID	{"city": "Fort Holdenhaven", "state": "Iowa", "address1": "Suite 141", "address2": "493 Astrid Creek", "fullName": "Ralph Li", "postalCode": "85346", "mobilePhone": "+60566581417"}	2023-12-22 13:12:07.889
17	26	20.00	364.70	PAID	{"city": "South Florine", "state": "Maine", "address1": "Apt. 846", "address2": "60109 Sporer Rapids", "fullName": "Daisy Ridley", "postalCode": "46850", "mobilePhone": "+60970104433"}	2023-12-22 06:47:42.347
18	24	20.00	46.60	PAID	{"city": "Providence", "state": "New Mexico", "address1": "Apt. 670", "address2": "402 Odie Place", "fullName": "Lucy Lily", "postalCode": "61922", "mobilePhone": "+60390431462"}	2023-12-21 11:31:37.276
19	21	20.00	77.60	PAID	{"city": "Lake Angelita", "state": "West Virginia", "address1": "Apt. 537", "address2": "52475 Ullrich Terrace", "fullName": "Hugh Morse", "postalCode": "33292", "mobilePhone": "+60143226161"}	2023-12-21 06:06:08.436
20	20	20.00	75.60	PAID	{"city": "North Vernieview", "state": "Hawaii", "address1": "Apt. 578", "address2": "4423 Domingo Shore", "fullName": "Mason Jar", "postalCode": "17397", "mobilePhone": "+60440319227"}	2023-12-18 06:45:59.936
21	32	20.00	59.00	PAID	{"city": "New Magnoliaborough", "state": "Oregon", "address1": "Suite 437", "address2": "163 Haag Hill", "fullName": "Jane Emma", "postalCode": "66239", "mobilePhone": "+60237269334"}	2023-12-12 17:30:48.352
22	20	20.00	145.10	PAID	{"city": "Brookhaven", "state": "Kansas", "address1": "Suite 317", "address2": "78596 Stamm Centers", "fullName": "Mason Jar", "postalCode": "93649", "mobilePhone": "+60296643320"}	2023-12-11 12:37:54.628
23	36	20.00	214.80	PAID	{"city": "Citrus Heights", "state": "South Carolina", "address1": "Suite 359", "address2": "53702 Cordell Valley", "fullName": "Faith Yeoh", "postalCode": "33900", "mobilePhone": "+60719846154"}	2023-12-11 06:52:50.829
24	3	20.00	126.20	PAID	{"city": "Fort Waylon", "state": "Colorado", "address1": "Suite 450", "address2": "32756 Annabell Views", "fullName": "Ellis Elton", "postalCode": "05597", "mobilePhone": "+60477375210"}	2023-12-07 15:40:32.035
25	29	20.00	260.90	PAID	{"city": "Southfield", "state": "Texas", "address1": "Suite 156", "address2": "91236 Kale Stravenue", "fullName": "Hazel Chang", "postalCode": "66016", "mobilePhone": "+60719801496"}	2023-12-06 23:22:22.092
26	19	20.00	52.80	PAID	{"city": "South Toyfurt", "state": "Hawaii", "address1": "Apt. 820", "address2": "77036 Valentine Squares", "fullName": "Parker Pens", "postalCode": "76547", "mobilePhone": "+60659612076"}	2023-12-06 01:32:40.742
27	34	20.00	120.50	PAID	{"city": "O'Keefechester", "state": "Missouri", "address1": "Apt. 361", "address2": "2542 Alec Oval", "fullName": "Etta Amelia", "postalCode": "86702", "mobilePhone": "+60465910616"}	2023-11-29 01:46:18.995
28	33	20.00	53.80	PAID	{"city": "Josemouth", "state": "Iowa", "address1": "Suite 265", "address2": "693 Laurine Meadow", "fullName": "Evelyn Charlotte", "postalCode": "91536", "mobilePhone": "+60656207064"}	2023-11-26 11:57:26.976
29	17	20.00	77.60	PAID	{"city": "Connellyberg", "state": "Iowa", "address1": "Apt. 443", "address2": "7912 Jerry Locks", "fullName": "Alfred Albert", "postalCode": "11179", "mobilePhone": "+60075135196"}	2023-11-19 20:46:12.763
30	18	20.00	75.60	PAID	{"city": "North Carter", "state": "Minnesota", "address1": "Suite 733", "address2": "207 Brooks Viaduct", "fullName": "Charlie Puth", "postalCode": "89671", "mobilePhone": "+60112091375"}	2023-11-20 07:20:13.124
31	14	20.00	173.60	PAID	{"city": "West Hope", "state": "Oregon", "address1": "Suite 130", "address2": "86952 Orn Garden", "fullName": "Julian Purple", "postalCode": "90516", "mobilePhone": "+60436346193"}	2023-11-13 04:35:43.201
32	44	20.00	89.90	PAID	{"city": "South Keshaunside", "state": "Oregon", "address1": "Apt. 616", "address2": "83556 Bashirian Drives", "fullName": "Henrietta Sol", "postalCode": "17152", "mobilePhone": "+60172987705"}	2023-11-12 03:02:32.707
33	16	20.00	60.00	PAID	{"city": "Koelpintown", "state": "Missouri", "address1": "Suite 276", "address2": "3636 Afton Hill", "fullName": "Lewis Hamilton", "postalCode": "88272", "mobilePhone": "+60157979054"}	2023-11-10 19:17:54.464
34	28	20.00	104.80	PAID	{"city": "East Warrenton", "state": "Kansas", "address1": "Apt. 693", "address2": "277 Dewitt Ways", "fullName": "Lily Fuentes", "postalCode": "01919", "mobilePhone": "+60598497808"}	2023-11-07 12:03:26.439
35	29	20.00	291.70	PAID	{"city": "Lake Camren", "state": "Georgia", "address1": "Suite 606", "address2": "32279 Lafayette Skyway", "fullName": "Hazel Chang", "postalCode": "62076", "mobilePhone": "+60960287192"}	2023-11-06 22:04:36.942
36	19	20.00	52.80	PAID	{"city": "New Geovanny", "state": "Missouri", "address1": "Apt. 852", "address2": "1519 Mohr Throughway", "fullName": "Parker Pens", "postalCode": "87007", "mobilePhone": "+60966906465"}	2023-11-05 11:58:44.011
37	35	20.00	218.00	PAID	{"city": "Highlands Ranch", "state": "Oklahoma", "address1": "Suite 962", "address2": "8581 Bennett Divide", "fullName": "Annie Sophia", "postalCode": "80959", "mobilePhone": "+60809398278"}	2023-10-29 13:19:33.861
38	31	20.00	46.60	PAID	{"city": "South Augusta", "state": "Georgia", "address1": "Apt. 946", "address2": "73234 Evert Street", "fullName": "Scarlet AVa", "postalCode": "08876", "mobilePhone": "+60990832017"}	2023-10-27 22:53:01.815
39	13	20.00	77.60	PAID	{"city": "Lake Ida", "state": "Oklahoma", "address1": "Apt. 974", "address2": "68196 Jordane Vista", "fullName": "Cole Nick", "postalCode": "46049", "mobilePhone": "+60238124186"}	2023-10-21 05:08:37.962
40	18	20.00	75.60	PAID	{"city": "West Bruce", "state": "Kansas", "address1": "Suite 397", "address2": "795 Florian Shoals", "fullName": "Charlie Puth", "postalCode": "93406", "mobilePhone": "+60096087215"}	2023-10-21 04:03:46.591
41	17	20.00	167.90	PAID	{"city": "West Remingtonview", "state": "Michigan", "address1": "Suite 392", "address2": "172 Kreiger Branch", "fullName": "Alfred Albert", "postalCode": "14039", "mobilePhone": "+60506608976"}	2023-10-12 15:47:50.222
42	18	20.00	40.30	PAID	{"city": "Dothan", "state": "Arkansas", "address1": "Apt. 815", "address2": "1702 Kaycee Fork", "fullName": "Charlie Puth", "postalCode": "63623", "mobilePhone": "+60715618438"}	2023-10-12 01:56:39.669
43	22	20.00	30.00	PAID	{"city": "Frederickstead", "state": "Connecticut", "address1": "Suite 372", "address2": "78092 Kemmer Creek", "fullName": "Arden Argyle", "postalCode": "18787", "mobilePhone": "+60018665172"}	2023-10-10 15:26:31.395
44	28	20.00	107.40	PAID	{"city": "Deionside", "state": "Nevada", "address1": "Suite 724", "address2": "73281 Jaiden Throughway", "fullName": "Lily Fuentes", "postalCode": "01705", "mobilePhone": "+60497886659"}	2023-10-07 18:59:54.939
45	28	20.00	291.70	PAID	{"city": "Bernieborough", "state": "Hawaii", "address1": "Suite 515", "address2": "3775 Lind Highway", "fullName": "Lily Fuentes", "postalCode": "39458", "mobilePhone": "+60707039935"}	2023-10-06 23:48:23.291
46	19	20.00	52.80	PAID	{"city": "Izaiahfort", "state": "Florida", "address1": "Suite 562", "address2": "6304 Doyle Rapids", "fullName": "Parker Pens", "postalCode": "97890", "mobilePhone": "+60697646748"}	2023-10-05 16:27:11.513
47	27	20.00	189.10	PAID	{"city": "Shanahanmouth", "state": "Missouri", "address1": "Suite 969", "address2": "1287 Lehner Vista", "fullName": "Olive Duck", "postalCode": "52034", "mobilePhone": "+60930378637"}	2023-09-29 04:17:43.56
48	31	20.00	46.60	PAID	{"city": "Brakusstead", "state": "Florida", "address1": "Suite 326", "address2": "603 Kub Lake", "fullName": "Scarlet AVa", "postalCode": "11599", "mobilePhone": "+60092153367"}	2023-09-27 03:35:05.433
49	17	20.00	28.90	PAID	{"city": "East Waylontown", "state": "Washington", "address1": "Apt. 614", "address2": "78688 Nader Ridges", "fullName": "Alfred Albert", "postalCode": "95453", "mobilePhone": "+60208882169"}	2023-09-20 07:25:34.462
50	43	20.00	103.00	PAID	{"city": "North Oscarstead", "state": "Kentucky", "address1": "Apt. 806", "address2": "15839 Hahn Spur", "fullName": "May Alora", "postalCode": "84186", "mobilePhone": "+60138626028"}	2023-09-20 04:43:04.211
51	3	20.00	67.70	PAID	{"city": "Tremblaybury", "state": "West Virginia", "address1": "Suite 369", "address2": "238 Wuckert Extensions", "fullName": "Ellis Elton", "postalCode": "83415", "mobilePhone": "+60605096384"}	2023-09-13 05:29:18.266
52	4	20.00	104.80	PAID	{"city": "Lake Dylan", "state": "South Dakota", "address1": "Apt. 602", "address2": "7071 Rosenbaum Ports", "fullName": "Edith Bob", "postalCode": "32430", "mobilePhone": "+60307237318"}	2023-09-11 21:13:33.47
53	17	20.00	64.00	PAID	{"city": "Pagacboro", "state": "Maryland", "address1": "Apt. 507", "address2": "91657 Ratke Via", "fullName": "Alfred Albert", "postalCode": "22513", "mobilePhone": "+60481979303"}	2023-09-10 20:41:56.496
54	23	20.00	102.10	PAID	{"city": "Chattanooga", "state": "Texas", "address1": "Suite 648", "address2": "936 Mitchell Extension", "fullName": "Benett Leona", "postalCode": "16484", "mobilePhone": "+60234268079"}	2023-09-08 00:22:12.047
55	26	20.00	184.70	PAID	{"city": "Dustinworth", "state": "Wisconsin", "address1": "Apt. 955", "address2": "49481 Witting Village", "fullName": "Daisy Ridley", "postalCode": "08877", "mobilePhone": "+60858989104"}	2023-09-06 20:08:55.78
56	22	20.00	52.80	PAID	{"city": "Plainfield", "state": "Montana", "address1": "Apt. 443", "address2": "3109 Tyson Groves", "fullName": "Arden Argyle", "postalCode": "02930", "mobilePhone": "+60437602744"}	2023-09-06 02:02:04.078
57	42	20.00	189.10	PAID	{"city": "Dockboro", "state": "Oregon", "address1": "Apt. 637", "address2": "71120 Hilario Bridge", "fullName": "Kate Winona", "postalCode": "45555", "mobilePhone": "+60574407478"}	2023-08-29 13:58:13.478
58	28	20.00	46.60	PAID	{"city": "Brandon", "state": "Minnesota", "address1": "Apt. 362", "address2": "22749 Guido Track", "fullName": "Lily Fuentes", "postalCode": "29711", "mobilePhone": "+60539925050"}	2023-08-27 19:54:41.772
59	8	20.00	77.60	PAID	{"city": "Konopelskiland", "state": "Pennsylvania", "address1": "Suite 876", "address2": "28664 Brycen Fields", "fullName": "George Soros", "postalCode": "89896", "mobilePhone": "+60258110684"}	2023-08-21 07:46:59.268
60	7	20.00	75.60	PAID	{"city": "Welchside", "state": "Colorado", "address1": "Suite 816", "address2": "36074 Hyman Bridge", "fullName": "Tom Sawyer", "postalCode": "50405", "mobilePhone": "+60388193289"}	2023-08-20 08:09:08.039
61	14	20.00	153.80	PAID	{"city": "North Leone", "state": "North Dakota", "address1": "Suite 879", "address2": "16042 Wiza Squares", "fullName": "Julian Purple", "postalCode": "76929", "mobilePhone": "+60816186716"}	2023-08-13 02:42:31.319
62	17	20.00	129.40	PAID	{"city": "Edwinachester", "state": "Oregon", "address1": "Apt. 241", "address2": "2854 Jettie Court", "fullName": "Alfred Albert", "postalCode": "79324", "mobilePhone": "+60797293958"}	2023-08-12 07:09:47.535
63	16	20.00	206.10	PAID	{"city": "Hammescester", "state": "Vermont", "address1": "Suite 338", "address2": "4612 Chaim Hill", "fullName": "Lewis Hamilton", "postalCode": "30672", "mobilePhone": "+60014905340"}	2023-08-10 19:15:23.552
64	39	20.00	77.40	PAID	{"city": "South Kim", "state": "Missouri", "address1": "Suite 491", "address2": "271 O'Keefe Pine", "fullName": "Maggie Apple", "postalCode": "51132", "mobilePhone": "+60340440316"}	2023-08-07 23:32:05.804
65	37	20.00	176.20	PAID	{"city": "Lubowitzberg", "state": "Montana", "address1": "Suite 245", "address2": "95956 Jaren Flats", "fullName": "Rosie Mia", "postalCode": "82012", "mobilePhone": "+60652962881"}	2023-08-06 09:15:23.64
66	42	20.00	86.70	PAID	{"city": "Eunastead", "state": "Mississippi", "address1": "Apt. 173", "address2": "569 Stuart Keys", "fullName": "Kate Winona", "postalCode": "55545", "mobilePhone": "+60877718370"}	2023-08-05 18:04:04.574
67	41	20.00	189.10	PAID	{"city": "Albertafort", "state": "North Carolina", "address1": "Apt. 636", "address2": "572 Weissnat Crossroad", "fullName": "Jenna Jen", "postalCode": "89556", "mobilePhone": "+60454286109"}	2023-07-30 05:24:48.901
68	40	20.00	139.80	PAID	{"city": "Laurencetown", "state": "West Virginia", "address1": "Suite 974", "address2": "661 Cody Via", "fullName": "Sunny Lily", "postalCode": "20922", "mobilePhone": "+60847805368"}	2023-07-28 01:40:02.34
69	17	20.00	77.60	PAID	{"city": "East Clarachester", "state": "New Mexico", "address1": "Apt. 495", "address2": "17599 Bauch Ford", "fullName": "Alfred Albert", "postalCode": "33100", "mobilePhone": "+60728944094"}	2023-07-20 19:07:35.005
70	20	20.00	37.80	PAID	{"city": "Howellside", "state": "Nevada", "address1": "Suite 673", "address2": "879 Mills Drive", "fullName": "Mason Jar", "postalCode": "44900", "mobilePhone": "+60967162027"}	2023-07-21 01:48:30.627
71	14	20.00	70.80	PAID	{"city": "Cadeport", "state": "Virginia", "address1": "Apt. 445", "address2": "8511 Carson Stravenue", "fullName": "Julian Purple", "postalCode": "81606", "mobilePhone": "+60339224412"}	2023-07-12 13:21:33.518
72	11	20.00	67.50	PAID	{"city": "Hillarymouth", "state": "California", "address1": "Apt. 288", "address2": "3372 Deckow Mountain", "fullName": "Nash Brown", "postalCode": "48305", "mobilePhone": "+60522959143"}	2023-07-12 00:48:06.786
73	21	20.00	64.00	PAID	{"city": "Port Jalen", "state": "West Virginia", "address1": "Apt. 155", "address2": "36367 Greenfelder Valleys", "fullName": "Hugh Morse", "postalCode": "57199", "mobilePhone": "+60046874501"}	2023-07-11 02:19:53.397
74	28	20.00	77.40	PAID	{"city": "Ofelialand", "state": "Alabama", "address1": "Apt. 669", "address2": "77085 Israel Mount", "fullName": "Lily Fuentes", "postalCode": "57485", "mobilePhone": "+60988027263"}	2023-07-07 14:43:42.713
75	29	20.00	291.70	PAID	{"city": "Lake Tyriquebury", "state": "Ohio", "address1": "Suite 164", "address2": "667 Kihn Bridge", "fullName": "Hazel Chang", "postalCode": "17795", "mobilePhone": "+60899133962"}	2023-07-06 20:03:19.112
76	19	20.00	52.80	PAID	{"city": "Feliciaburgh", "state": "West Virginia", "address1": "Apt. 398", "address2": "6693 Hudson Fields", "fullName": "Parker Pens", "postalCode": "31768", "mobilePhone": "+60125315676"}	2023-07-05 18:16:27.268
77	43	20.00	433.30	PAID	{"city": "Port Emanuel", "state": "Missouri", "address1": "Apt. 386", "address2": "4313 Turner Extension", "fullName": "May Alora", "postalCode": "44569", "mobilePhone": "+60824443757"}	2023-06-28 21:26:43.093
78	31	20.00	46.60	PAID	{"city": "Jammieland", "state": "Maine", "address1": "Suite 981", "address2": "1777 Peyton Via", "fullName": "Scarlet AVa", "postalCode": "50390", "mobilePhone": "+60210237353"}	2023-06-26 09:49:24.529
79	17	20.00	77.60	PAID	{"city": "Yvonnetown", "state": "Utah", "address1": "Apt. 471", "address2": "46561 Skye Courts", "fullName": "Alfred Albert", "postalCode": "81048", "mobilePhone": "+60632257488"}	2023-06-19 15:46:24.358
80	18	20.00	75.60	PAID	{"city": "Lockmanside", "state": "Idaho", "address1": "Suite 980", "address2": "13489 Frederick Ports", "fullName": "Charlie Puth", "postalCode": "76746", "mobilePhone": "+60925840609"}	2023-06-19 13:22:01.918
81	4	20.00	32.00	PAID	{"city": "Gabrielleton", "state": "New Hampshire", "address1": "Suite 226", "address2": "496 Lang Mall", "fullName": "Edith Bob", "postalCode": "80239", "mobilePhone": "+60895180419"}	2023-06-13 05:20:58.817
82	11	20.00	201.70	PAID	{"city": "Port Junior", "state": "Wisconsin", "address1": "Suite 637", "address2": "150 Crist Mission", "fullName": "Nash Brown", "postalCode": "21813", "mobilePhone": "+60020107116"}	2023-06-11 23:48:27.343
83	16	20.00	60.00	PAID	{"city": "Laurianeshire", "state": "New Hampshire", "address1": "Apt. 187", "address2": "7662 Daisy Extension", "fullName": "Lewis Hamilton", "postalCode": "65186", "mobilePhone": "+60622288902"}	2023-06-10 13:43:00.573
84	28	20.00	57.80	PAID	{"city": "Lake Roelside", "state": "North Carolina", "address1": "Suite 820", "address2": "777 Willis Forks", "fullName": "Lily Fuentes", "postalCode": "82968", "mobilePhone": "+60581008298"}	2023-06-07 22:17:18.996
85	29	20.00	291.70	PAID	{"city": "South Eladiostead", "state": "Ohio", "address1": "Suite 494", "address2": "279 Taya Flats", "fullName": "Hazel Chang", "postalCode": "09423", "mobilePhone": "+60019982443"}	2023-06-06 10:26:35.661
86	3	20.00	45.00	PAID	{"city": "East Zula", "state": "Michigan", "address1": "Suite 275", "address2": "32442 Dickens Port", "fullName": "Ellis Elton", "postalCode": "49410", "mobilePhone": "+60559258949"}	2023-06-05 20:34:18.604
87	27	20.00	364.70	PAID	{"city": "West Cicero", "state": "Washington", "address1": "Suite 820", "address2": "652 Kaci Ville", "fullName": "Olive Duck", "postalCode": "37967", "mobilePhone": "+60497852975"}	2023-05-30 01:48:30.826
88	31	20.00	46.60	PAID	{"city": "New Murphyshire", "state": "Indiana", "address1": "Suite 785", "address2": "177 Janick Crossroad", "fullName": "Scarlet AVa", "postalCode": "34253", "mobilePhone": "+60612211909"}	2023-05-27 19:07:27.142
89	36	20.00	108.90	PAID	{"city": "Daisyfort", "state": "New York", "address1": "Suite 958", "address2": "288 Zackery Knoll", "fullName": "Faith Yeoh", "postalCode": "77618", "mobilePhone": "+60936978793"}	2023-05-20 13:15:52.2
90	5	20.00	201.10	PAID	{"city": "Wehnerland", "state": "Maryland", "address1": "Apt. 106", "address2": "536 Walker Wall", "fullName": "Jack Zhang", "postalCode": "35912", "mobilePhone": "+60389878209"}	2023-05-20 14:16:37.116
91	42	20.00	28.90	PAID	{"city": "New Eloise", "state": "New Jersey", "address1": "Apt. 467", "address2": "38662 Blanda Trafficway", "fullName": "Kate Winona", "postalCode": "10351", "mobilePhone": "+60659813010"}	2023-05-12 16:50:58.778
92	12	20.00	169.40	PAID	{"city": "Carterstad", "state": "Kansas", "address1": "Apt. 243", "address2": "39663 Hyman Islands", "fullName": "Ralph Li", "postalCode": "74789", "mobilePhone": "+60417563755"}	2023-05-11 21:22:01.418
93	16	20.00	60.00	PAID	{"city": "Laurabury", "state": "Nebraska", "address1": "Suite 372", "address2": "94937 Heller Junctions", "fullName": "Lewis Hamilton", "postalCode": "88091", "mobilePhone": "+60869544521"}	2023-05-11 05:48:17.686
94	41	20.00	82.30	PAID	{"city": "Luefield", "state": "New Jersey", "address1": "Apt. 344", "address2": "6192 Breitenberg Gardens", "fullName": "Jenna Jen", "postalCode": "66162", "mobilePhone": "+60275284407"}	2023-05-07 12:39:50.621
95	29	20.00	291.70	PAID	{"city": "West Bradyborough", "state": "Montana", "address1": "Apt. 747", "address2": "13449 Leilani Rest", "fullName": "Hazel Chang", "postalCode": "74159", "mobilePhone": "+60209424310"}	2023-05-06 23:52:24.748
96	23	20.00	26.40	PAID	{"city": "Millerstad", "state": "New Mexico", "address1": "Apt. 770", "address2": "1223 Gusikowski Viaduct", "fullName": "Benett Leona", "postalCode": "27010", "mobilePhone": "+60979491693"}	2023-05-05 22:24:04.565
97	33	20.00	189.10	PAID	{"city": "Diannastad", "state": "Georgia", "address1": "Suite 812", "address2": "63204 Consuelo Skyway", "fullName": "Evelyn Charlotte", "postalCode": "52893", "mobilePhone": "+60312295294"}	2023-04-28 16:19:07.256
98	14	20.00	70.80	PAID	{"city": "Fort Jerald", "state": "Kentucky", "address1": "Suite 275", "address2": "4491 Kris Skyway", "fullName": "Julian Purple", "postalCode": "07109", "mobilePhone": "+60238940701"}	2023-04-12 23:38:58.092
99	17	20.00	104.80	PAID	{"city": "Colefurt", "state": "New Hampshire", "address1": "Apt. 664", "address2": "66111 Mayer Alley", "fullName": "Alfred Albert", "postalCode": "81923", "mobilePhone": "+60087453835"}	2023-04-11 10:35:10.699
100	44	20.00	257.70	PAID	{"city": "Collierboro", "state": "Tennessee", "address1": "Apt. 759", "address2": "606 Maya Mills", "fullName": "Henrietta Sol", "postalCode": "43014", "mobilePhone": "+60245785768"}	2023-03-29 13:18:47.594
101	28	20.00	46.60	PAID	{"city": "Apopka", "state": "Kentucky", "address1": "Suite 730", "address2": "4531 Erling Divide", "fullName": "Lily Fuentes", "postalCode": "38981", "mobilePhone": "+60244043915"}	2023-03-27 17:11:36.486
102	22	20.00	116.40	PAID	{"city": "Laishaville", "state": "New Mexico", "address1": "Apt. 588", "address2": "6886 Auer Field", "fullName": "Arden Argyle", "postalCode": "11468", "mobilePhone": "+60751095321"}	2023-03-21 07:36:51.671
103	8	20.00	76.60	PAID	{"city": "Angelineland", "state": "Washington", "address1": "Suite 818", "address2": "2634 Parker Terrace", "fullName": "George Soros", "postalCode": "06006", "mobilePhone": "+60160780937"}	2023-03-13 06:06:07.142
104	13	20.00	83.80	PAID	{"city": "Rennerfort", "state": "Tennessee", "address1": "Suite 398", "address2": "93149 Runolfsdottir Turnpike", "fullName": "Cole Nick", "postalCode": "04968", "mobilePhone": "+60207970109"}	2023-03-11 08:10:50.14
105	16	20.00	116.80	PAID	{"city": "O'Konville", "state": "Hawaii", "address1": "Apt. 472", "address2": "675 Nyasia Ferry", "fullName": "Lewis Hamilton", "postalCode": "32118", "mobilePhone": "+60961129819"}	2023-03-10 18:02:13.414
106	40	20.00	46.60	PAID	{"city": "North Camrenview", "state": "Colorado", "address1": "Apt. 190", "address2": "206 Waters Pines", "fullName": "Sunny Lily", "postalCode": "10031", "mobilePhone": "+60438127944"}	2023-03-08 06:41:57.461
107	29	20.00	131.20	PAID	{"city": "Kleinstad", "state": "Washington", "address1": "Apt. 236", "address2": "27058 Ellsworth Causeway", "fullName": "Hazel Chang", "postalCode": "66593", "mobilePhone": "+60445067707"}	2023-03-06 14:10:49.089
108	23	20.00	77.60	PAID	{"city": "Fort Aidan", "state": "Washington", "address1": "Apt. 503", "address2": "266 Fredrick Landing", "fullName": "Benett Leona", "postalCode": "06080", "mobilePhone": "+60813610905"}	2023-02-12 23:42:08.383
\.


--
-- Data for Name: product_association_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_association_types (id, type_name, created_at) FROM stdin;
\.


--
-- Data for Name: product_associations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_associations (product_association_type_id, product_id) FROM stdin;
\.


--
-- Data for Name: product_configurable_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_configurable_options (id, product_id, product_option_code) FROM stdin;
1	1	shirts_color
2	1	size
3	2	shirts_color
4	2	size
5	3	shirts_color
6	3	size
7	4	shirts_color
8	4	size
9	5	shirts_color
10	5	size
11	6	shirts_color
12	6	size
13	7	shorts_color
14	7	size
15	8	shorts_color
16	8	size
17	9	jeans_color
18	9	men_jeans_size
19	10	jeans_color
20	10	men_jeans_size
21	11	jeans_color
22	11	men_jeans_size
23	12	jeans_color
24	12	men_jeans_size
25	13	shirts_color
26	13	size
27	14	shirts_color
28	14	size
29	15	shirts_color
30	15	size
31	16	shirts_color
32	16	size
33	17	shirts_color
34	17	size
35	18	shirts_color
36	18	size
37	19	skirts_color
38	19	size
39	20	skirts_color
40	20	size
41	21	skirts_color
42	21	size
43	22	jeans_color
44	22	women_jeans_size
45	23	jeans_color
46	23	women_jeans_size
\.


--
-- Data for Name: product_option_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option_values (id, option_code, option_value, updated_at, created_at) FROM stdin;
1	skirts_color	Red	2024-01-14 12:03:49.451164	2024-01-14 12:03:49.451164
2	skirts_color	Black	2024-01-14 12:03:49.451753	2024-01-14 12:03:49.451753
3	shorts_color	Brown	2024-01-14 12:03:49.452441	2024-01-14 12:03:49.452441
4	shorts_color	Blue	2024-01-14 12:03:49.452865	2024-01-14 12:03:49.452865
5	jeans_color	Blue	2024-01-14 12:03:49.453504	2024-01-14 12:03:49.453504
6	jeans_color	Navy	2024-01-14 12:03:49.45379	2024-01-14 12:03:49.45379
7	jeans_color	Natural	2024-01-14 12:03:49.454084	2024-01-14 12:03:49.454084
8	shirts_color	Green	2024-01-14 12:03:49.454632	2024-01-14 12:03:49.454632
9	shirts_color	White	2024-01-14 12:03:49.454915	2024-01-14 12:03:49.454915
10	shirts_color	Grey	2024-01-14 12:03:49.455195	2024-01-14 12:03:49.455195
11	shirts_color	Red	2024-01-14 12:03:49.455474	2024-01-14 12:03:49.455474
12	shirts_color	Black	2024-01-14 12:03:49.455811	2024-01-14 12:03:49.455811
13	jackets_color	Blue	2024-01-14 12:03:49.456503	2024-01-14 12:03:49.456503
14	jackets_color	Red	2024-01-14 12:03:49.456783	2024-01-14 12:03:49.456783
15	jackets_color	Green	2024-01-14 12:03:49.45705	2024-01-14 12:03:49.45705
16	size	S	2024-01-14 12:03:49.457584	2024-01-14 12:03:49.457584
17	size	M	2024-01-14 12:03:49.45785	2024-01-14 12:03:49.45785
18	size	L	2024-01-14 12:03:49.458112	2024-01-14 12:03:49.458112
19	size	XL	2024-01-14 12:03:49.458395	2024-01-14 12:03:49.458395
20	men_jeans_size	29 inch	2024-01-14 12:03:49.458967	2024-01-14 12:03:49.458967
21	men_jeans_size	30 inch	2024-01-14 12:03:49.459242	2024-01-14 12:03:49.459242
22	men_jeans_size	31 inch	2024-01-14 12:03:49.4595	2024-01-14 12:03:49.4595
23	men_jeans_size	32 inch	2024-01-14 12:03:49.459818	2024-01-14 12:03:49.459818
24	men_jeans_size	33 inch	2024-01-14 12:03:49.460075	2024-01-14 12:03:49.460075
25	women_jeans_size	24 inch	2024-01-14 12:03:49.460587	2024-01-14 12:03:49.460587
26	women_jeans_size	25 inch	2024-01-14 12:03:49.460842	2024-01-14 12:03:49.460842
27	women_jeans_size	26 inch	2024-01-14 12:03:49.461095	2024-01-14 12:03:49.461095
28	women_jeans_size	27 inch	2024-01-14 12:03:49.461559	2024-01-14 12:03:49.461559
29	women_jeans_size	28 inch	2024-01-14 12:03:49.461821	2024-01-14 12:03:49.461821
30	women_jeans_size	29 inch	2024-01-14 12:03:49.462078	2024-01-14 12:03:49.462078
31	women_jeans_size	30 inch	2024-01-14 12:03:49.462328	2024-01-14 12:03:49.462328
32	women_jeans_size	31 inch	2024-01-14 12:03:49.462577	2024-01-14 12:03:49.462577
33	women_jeans_size	32 inch	2024-01-14 12:03:49.462828	2024-01-14 12:03:49.462828
34	women_jeans_size	33 inch	2024-01-14 12:03:49.463081	2024-01-14 12:03:49.463081
\.


--
-- Data for Name: product_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_options (code, option_name, "position", updated_at, created_at) FROM stdin;
skirts_color	Color	1	2024-01-14 12:03:49.450561	2024-01-14 12:03:49.450561
shorts_color	Color	2	2024-01-14 12:03:49.452054	2024-01-14 12:03:49.452054
jeans_color	Color	3	2024-01-14 12:03:49.453174	2024-01-14 12:03:49.453174
shirts_color	Color	4	2024-01-14 12:03:49.454357	2024-01-14 12:03:49.454357
jackets_color	Color	5	2024-01-14 12:03:49.456212	2024-01-14 12:03:49.456212
size	Size	6	2024-01-14 12:03:49.457322	2024-01-14 12:03:49.457322
men_jeans_size	Size	7	2024-01-14 12:03:49.458705	2024-01-14 12:03:49.458705
women_jeans_size	Size	8	2024-01-14 12:03:49.460338	2024-01-14 12:03:49.460338
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_reviews (order_id, product_id, comment, rating, created_at) FROM stdin;
61	1	I received many compliments when I wore the Slim Fit Dotted Polo to a party. The design is eye-catching, and the fit is just right. Definitely a statement piece in my collection!	4	2023-10-14 18:18:17.082
49	1	The quality of the Slim Fit Dotted Polo exceeded my expectations. The fit is slim and flattering, and the dotted pattern gives it a unique and trendy look. Great addition to my wardrobe!	5	2023-11-03 18:48:14.196
51	1	I'm a bit disappointed with the Slim Fit Dotted Polo. The fit is tighter than expected, and the material feels a bit scratchy on the skin. Not as comfortable as I had hoped.	3	2023-12-05 17:17:22.727
2	2	The Short Sleeve Polo is okay, but the quality could be better. After a few washes, I noticed some fading, and the fabric doesn't feel as durable as I would like. Decent for the price.	4	2024-01-13 16:08:50.487
99	2	I'm a repeat customer for the Short Sleeve Polo. It's comfortable, versatile, and easy to style. Perfect for lazy weekends or a quick brunch with friends. Highly recommended!	5	2023-07-29 01:51:38.92
81	2	This Short Sleeve Polo is fantastic! The material is breathable, and it's ideal for warm weather. I bought it in two colors because I love it so much. Definitely a must-have in any closet!	5	2024-01-07 15:10:45.075
82	2	I'm in love with the Short Sleeve Polo! It's my go-to for casual outings. The fabric is soft, and the fit is relaxed. I bought one in every color – that's how much I adore it!	5	2023-12-09 17:08:54.882
11	2	The Short Sleeve Polo is a classic wardrobe staple! It's versatile and comfortable, making it perfect for everyday wear. I love the quality of the fabric and the relaxed fit.	5	2024-01-10 07:36:11.788
22	2	I can't get enough of the Short Sleeve Polo! It's so easy to style and can be dressed up or down. The short sleeves make it perfect for casual days, and the fit is just right. Highly recommend!	5	2024-01-14 05:54:34.517
105	4	This Regular Fit Crew-neck T-Shirt is my favorite go-to tee. The fit is comfortable, and the material is durable. Great value for the price!	5	2023-09-04 17:27:04.102
72	4	I'm not a fan of the Regular Fit Crew-neck T-Shirt. The fit is too loose for my liking, and the fabric feels a bit cheap. Disappointed with the purchase.	4	2023-10-10 03:38:33.023
96	4	The Regular Fit Crew-neck T-Shirt is perfect for a relaxed look. The fit is just right, and it's great for layering. I have it in multiple colors!	5	2023-07-09 16:33:24.244
6	4	The Regular Fit Crew-neck T-Shirt is a classic! It's comfortable, and the fit is just right. Perfect for everyday wear.	5	2024-01-12 01:40:30.295
86	4	I love the simplicity of the Regular Fit Crew-neck T-Shirt. It's soft, easy to style, and a must-have in any casual wardrobe.	5	2023-09-27 00:31:51.057
60	5	I'm obsessed with the Oversized Round-neck T-Shirt! The fit is trendy, and it's so comfortable to wear. A must-have for anyone who loves oversized fashion.	5	2023-09-14 05:53:46.695
10	5	I expected the Oversized Round-neck T-Shirt to be more oversized. It's just a bit looser than a regular fit. However, the quality is good, and it's still a nice addition to my wardrobe.	4	2024-01-13 15:52:41.32
54	5	The Oversized Round-neck T-Shirt is not my style. The fit is too baggy, and it looks unflattering. I was hoping for a more fashionable oversized look.	3	2023-10-08 23:05:56.352
90	5	This Oversized Round-neck T-Shirt is a game-changer! The fit is perfect, and it's so versatile. I wear it with jeans or leggings for a casual, chic look.	5	2023-08-07 11:50:07.425
80	5	The Oversized Round-neck T-Shirt is my new favorite! It's stylish, and the fit is just what I was looking for. I bought it in two colors, and I'm thinking about getting more!	5	2023-12-14 19:07:55.685
92	6	The Relaxed Sleeveless T-Shirt is a summer essential! It's comfortable, and the relaxed fit is perfect for hot days. I love the casual vibe.	5	2023-08-18 04:17:40.931
105	7	I expected the Chinos Shorts to be a bit longer. They're almost too short for my liking. The fit is good, but a little more length would be perfect.	4	2024-01-12 06:58:58.005
73	7	I'm impressed with the quality of the Chinos Shorts! The fit is comfortable, and they're perfect for a day out or a casual dinner. Highly recommend.	5	2023-12-03 11:55:46.179
24	7	These Chinos Shorts are my go-to for a polished casual look! The fit is great, and they're easy to dress up or down. Definitely a summer wardrobe essential.	5	2023-12-31 21:10:09.977
53	7	The Chinos Shorts are a must-have for summer! The fit is just right, and they're so versatile. Great for a polished casual look.	5	2023-10-09 11:35:11.946
43	8	These Relaxed Striped Shorts are my go-to for a casual day out! The fit is great, and the stripes add a fun element. I pair them with sandals for the perfect summer look.	5	2023-10-16 10:46:35.706
93	8	I expected the Relaxed Striped Shorts to be a bit longer. They're almost too short for my taste. The fit is good, but a little more length would be perfect.	4	2023-08-14 17:50:36.576
13	8	The Relaxed Striped Shorts are a bit too baggy for my liking. While they're comfortable, I would prefer a slightly slimmer fit. Consider offering a more tailored option.	4	2024-01-08 17:30:03.356
3	8	I'm loving the Relaxed Striped Shorts! The fit is just right, and the stripes give them a nautical vibe. Great for a beach day or a casual outing.	5	2024-01-13 22:38:46.154
34	9	The Ultra Stretch Jeans are a game-changer! They're so comfortable and stretchy. The fit is perfect, and they're my new favorite pair of jeans.	5	2023-12-31 05:00:33.633
82	9	The Ultra Stretch Jeans are perfect for all-day wear! The fit is great, and the stretch makes them easy to move in. I'll be buying them in other colors too!	5	2023-08-10 08:06:23.026
92	9	I expected more stretch from the Ultra Stretch Jeans. They're comfortable, but I've had stretchier jeans before. The fit is good, but the name is a bit misleading.	4	2023-12-29 12:43:53.163
52	9	I'm impressed with the Ultra Stretch Jeans! The fit is fantastic, and the stretch makes them super comfortable. I highly recommend them.	5	2023-09-24 13:59:39.611
2	9	The Ultra Stretch Jeans are a bit too tight for my liking. While they stretch, they feel restrictive, especially around the waist. Consider sizing up for a more comfortable fit.	3	2024-01-13 05:43:18.645
90	10	I expected the Slim Fit Jeans to be more stretchy. While the fit is slim, they're not as flexible as I hoped. Still, they look great and are good for a night out.	4	2023-09-30 07:59:01.502
103	11	I expected the Jeans Shorts to be a bit longer. They're almost too short for my taste. The fit is good, but a little more length would be perfect.	5	2023-04-06 23:26:34.365
11	11	The Jeans Shorts are a bit too tight around the thighs for my liking. While they're comfortable, I would prefer a looser fit. Consider sizing up.	4	2024-01-11 13:06:01.668
79	11	These Jeans Shorts are a summer essential! The fit is just right, and they're so comfortable. Great for a casual, laid-back look.	5	2023-11-02 11:18:42.745
51	11	These Jeans Shorts are my favorite! The fit is great, and they're so versatile. I wear them with tees, tanks, and even blouses. Definitely a summer wardrobe staple.	5	2023-11-15 02:14:14.012
108	11	I'm loving these Jeans Shorts! The fit is fantastic, and they're my go-to for hot days. The quality is excellent, and they're easy to style.	5	2023-03-23 16:44:53.322
18	13	This Floral Long Sleeve Blouse is a showstopper! The fit is great, and the floral print is perfect for adding a pop of color to any outfit. A must-have for floral lovers.	5	2023-12-26 11:30:59.701
88	13	The Floral Long Sleeve Blouse is a bit too sheer for my liking. I had to wear a camisole underneath to feel comfortable. Consider using a slightly thicker fabric for future designs.	4	2023-06-02 19:27:22.904
32	13	I expected the Floral Long Sleeve Blouse to have a more tailored fit. It's a bit boxy on me. While the floral pattern is beautiful, the fit could be more flattering.	4	2023-12-14 09:42:20.767
8	13	I'm in love with the Floral Long Sleeve Blouse! The fit is just right, and the floral print adds a touch of elegance. Perfect for both casual and dressy occasions.	5	2024-01-10 10:09:30.442
101	13	The Floral Long Sleeve Blouse is a wardrobe standout! The floral pattern is vibrant, and the fit is feminine. I receive compliments every time I wear it.	5	2023-06-16 23:23:36.542
67	14	I was hoping for a more tailored fit with the Creped Blouse with Tie. It's a bit boxy on me, and I would prefer a more defined silhouette. The tie detail is cute, though.	4	2023-08-15 21:09:02.734
107	14	The Creped Blouse with Tie is a versatile piece! I love how the tie detail adds a touch of sophistication. The fit is comfortable, and it's perfect for both work and casual outings.	5	2023-04-23 11:01:27.564
97	14	I'm impressed with the quality of the Creped Blouse with Tie! The fit is just right, and the tie detail elevates the overall look. Highly recommend for a polished style.	5	2023-10-27 03:04:40.899
5	14	This Creped Blouse with Tie is a wardrobe essential! The fit is great, and the tie detail adds a feminine touch. I wear it to work and for casual outings. A versatile piece.	5	2024-01-13 18:40:24.16
57	14	The Creped Blouse with Tie is a bit too short for my liking. I expected a longer length. The tie detail is lovely, but I would prefer more coverage. Consider offering a longer version.	5	2023-11-16 12:25:57.558
25	15	The Pleated Long Sleeve Blouse is a bit too tight around the bust for my liking. While the pleats are lovely, I would prefer a more relaxed fit. Consider offering a looser option.	4	2024-01-04 19:00:06.547
65	15	I'm in love with the Pleated Long Sleeve Blouse! The fit is just right, and the pleated detailing gives it an elegant touch. Perfect for a dressy occasion or a night out.	5	2024-01-03 20:53:15.235
28	15	The Pleated Long Sleeve Blouse is a feminine delight! The pleats add a beautiful texture, and the fit is flattering. I receive compliments every time I wear it.	5	2023-12-03 11:21:16.226
91	16	This Striped Short-Sleeve T-Shirt is a staple in my wardrobe! The fit is great, and the stripes are a classic touch. I wear it for casual days and layer it for a chic look.	5	2023-08-04 23:30:13.832
4	16	The Striped Short-Sleeve T-Shirt is a classic! I love the timeless appeal of stripes, and the fit is just right. A must-have for casual, everyday wear.	5	2024-01-10 18:44:03.823
94	16	The Striped Short-Sleeve T-Shirt is a bit too short for my liking. I expected a longer length. While the fit is good, I prefer tees with a bit more coverage.	4	2023-11-10 10:25:38.265
14	16	I was hoping for a more vibrant color in the Striped Short-Sleeve T-Shirt. The stripes are a bit muted, and I wanted something more eye-catching. The fit is good, though.	4	2023-12-27 04:01:10.414
37	16	I'm loving the Striped Short-Sleeve T-Shirt! The fit is fantastic, and the striped pattern adds a playful element. Great for pairing with jeans or shorts.	5	2023-11-05 16:46:16.126
21	17	This USA Gray Mini T-Shirt is my go-to for a casual look! The fit is great, and the graphic adds a playful element. I wear it for holidays and events.	5	2023-12-22 05:43:14.723
32	19	I'm in love with the Long Floral Skirt! The floral pattern is so pretty, and the length is just right. It's versatile enough to wear casually or dress up for a special occasion. Definitely a wardrobe favorite.	5	2023-12-06 19:01:15.289
89	19	I adore the Long Floral Skirt! It's such a feminine and versatile piece. The floral pattern is lovely, and the length is just right. I feel confident and stylish whenever I wear it. Highly recommend!	5	2023-12-08 16:06:38.613
7	20	The Red Checked Skirt is a standout in my closet! The red checks are vibrant, and the fit is flattering. It's great for adding a pop of color to any outfit. I highly recommend it to those who love bold fashion.	5	2024-01-07 17:21:30.073
45	20	I'm obsessed with the Red Checked Skirt! The pattern is trendy, and the fit is fantastic. It's a versatile piece that can be dressed up or down. I've received so many compliments on it already!	5	2023-10-20 23:07:31.032
87	20	The Red Checked Skirt is a winner! The pattern is bold, and the fit is stylish. It's a versatile piece that can be paired with a variety of tops. I love how it adds a touch of personality to my outfits.	5	2023-07-24 11:18:56.142
77	20	Not a fan of bold patterns, but the Red Checked Skirt surprised me. The fit is comfortable, and the checks add a playful element without being too overwhelming. It's become a go-to piece in my wardrobe.	5	2023-12-31 14:25:47.54
5	20	The Red Checked Skirt is a fun and stylish choice! The checked pattern adds a playful touch, and the red color is bold and eye-catching. It's a statement piece that's perfect for any fashion-forward wardrobe.	5	2024-01-11 05:56:40.691
37	21	Short Sequin Skirt is a show-stopper! I wore it to a party, and I felt like the belle of the ball. The sequins are well-attached, and the fit is perfect. If you want to turn heads, this is the skirt to wear!	5	2023-11-25 18:27:04.271
77	21	I'm in love with the Short Sequin Skirt! The sequins sparkle beautifully, and the fit is fantastic. It's the perfect skirt for a special occasion or a night on the town. I've gotten so many compliments!	5	2023-11-07 23:20:41.755
87	21	The Short Sequin Skirt is a show-stopper! The sequins add a touch of glamour, and the length is perfect for a night out. I feel like a million bucks whenever I wear it. A must-have for party lovers!	5	2023-12-13 19:30:56.077
57	21	The Short Sequin Skirt exceeded my expectations! The sequins are high-quality and add a touch of luxury. The fit is great, and it's surprisingly comfortable for a sequin skirt. Definitely worth the investment.	5	2023-12-08 20:05:55.71
97	21	The Short Sequin Skirt is a statement piece in my wardrobe! The sequins catch the light in the most beautiful way, and the fit is both comfortable and flattering. I can't wait to wear it to my next event.	5	2023-09-04 15:04:20.945
14	22	Not a fan of the damaged trend, but these Ultra Stretch Jeans surprised me. The fit is fantastic, and the distressed details are subtle enough to add character without being overwhelming. Comfortable and stylish.	5	2024-01-03 07:27:58.386
24	22	I love the Ultra Stretch Jeans (Damaged)! The distressed elements give them a rock-chic vibe, and the stretchy fabric is a game-changer. Definitely a must-have for those who want to elevate their denim game.	5	2023-12-18 17:37:53.906
4	22	I was hesitant about the damaged look, but these Ultra Stretch Jeans won me over! They fit like a dream and have just the right amount of distressing. A stylish choice for a laid-back day.	5	2024-01-08 13:16:27.238
44	23	Wide Fit Jeans (Women) are a dream come true! Finally, jeans that are stylish and comfortable. The wide fit gives them a chic, laid-back look. Perfect for casual outings or dressing up with heels.	5	2023-10-17 07:05:03.077
23	23	Not a fan of the wide leg trend, but these Wide Fit Jeans surprised me. The fit is excellent, and they are surprisingly versatile. Dress them up with a blouse or keep it casual with a tee. Great addition to my closet.	5	2023-12-30 12:56:10.169
63	23	Wide Fit Jeans (Women) are my new go-to! The wide leg is not only fashionable but also comfortable. I can move freely, and they look great with both sneakers and heels. A definite wardrobe staple!	5	2023-09-28 03:11:56.008
\.


--
-- Data for Name: product_taxons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_taxons (id, product_id, taxon_id, updated_at, created_at) FROM stdin;
1	1	1	2024-01-14 12:03:49.477635	2024-01-14 12:03:49.477635
2	1	2	2024-01-14 12:03:49.477635	2024-01-14 12:03:49.477635
3	1	3	2024-01-14 12:03:49.477635	2024-01-14 12:03:49.477635
4	2	1	2024-01-14 12:03:49.484552	2024-01-14 12:03:49.484552
5	2	2	2024-01-14 12:03:49.484552	2024-01-14 12:03:49.484552
6	2	3	2024-01-14 12:03:49.484552	2024-01-14 12:03:49.484552
7	3	1	2024-01-14 12:03:49.492675	2024-01-14 12:03:49.492675
8	3	2	2024-01-14 12:03:49.492675	2024-01-14 12:03:49.492675
9	3	3	2024-01-14 12:03:49.492675	2024-01-14 12:03:49.492675
10	4	1	2024-01-14 12:03:49.499708	2024-01-14 12:03:49.499708
11	4	2	2024-01-14 12:03:49.499708	2024-01-14 12:03:49.499708
12	4	4	2024-01-14 12:03:49.499708	2024-01-14 12:03:49.499708
13	5	1	2024-01-14 12:03:49.504275	2024-01-14 12:03:49.504275
14	5	2	2024-01-14 12:03:49.504275	2024-01-14 12:03:49.504275
15	5	4	2024-01-14 12:03:49.504275	2024-01-14 12:03:49.504275
16	6	1	2024-01-14 12:03:49.508158	2024-01-14 12:03:49.508158
17	6	2	2024-01-14 12:03:49.508158	2024-01-14 12:03:49.508158
18	6	4	2024-01-14 12:03:49.508158	2024-01-14 12:03:49.508158
19	7	1	2024-01-14 12:03:49.512462	2024-01-14 12:03:49.512462
20	7	5	2024-01-14 12:03:49.512462	2024-01-14 12:03:49.512462
21	7	7	2024-01-14 12:03:49.512462	2024-01-14 12:03:49.512462
22	8	1	2024-01-14 12:03:49.515109	2024-01-14 12:03:49.515109
23	8	5	2024-01-14 12:03:49.515109	2024-01-14 12:03:49.515109
24	8	7	2024-01-14 12:03:49.515109	2024-01-14 12:03:49.515109
25	9	1	2024-01-14 12:03:49.518385	2024-01-14 12:03:49.518385
26	9	5	2024-01-14 12:03:49.518385	2024-01-14 12:03:49.518385
27	9	6	2024-01-14 12:03:49.518385	2024-01-14 12:03:49.518385
28	10	1	2024-01-14 12:03:49.524931	2024-01-14 12:03:49.524931
29	10	5	2024-01-14 12:03:49.524931	2024-01-14 12:03:49.524931
30	10	6	2024-01-14 12:03:49.524931	2024-01-14 12:03:49.524931
31	11	1	2024-01-14 12:03:49.529758	2024-01-14 12:03:49.529758
32	11	5	2024-01-14 12:03:49.529758	2024-01-14 12:03:49.529758
33	11	6	2024-01-14 12:03:49.529758	2024-01-14 12:03:49.529758
34	11	7	2024-01-14 12:03:49.529758	2024-01-14 12:03:49.529758
35	12	1	2024-01-14 12:03:49.537021	2024-01-14 12:03:49.537021
36	12	5	2024-01-14 12:03:49.537021	2024-01-14 12:03:49.537021
37	12	6	2024-01-14 12:03:49.537021	2024-01-14 12:03:49.537021
38	13	10	2024-01-14 12:03:49.542439	2024-01-14 12:03:49.542439
39	13	11	2024-01-14 12:03:49.542439	2024-01-14 12:03:49.542439
40	13	13	2024-01-14 12:03:49.542439	2024-01-14 12:03:49.542439
41	14	10	2024-01-14 12:03:49.546989	2024-01-14 12:03:49.546989
42	14	11	2024-01-14 12:03:49.546989	2024-01-14 12:03:49.546989
43	14	13	2024-01-14 12:03:49.546989	2024-01-14 12:03:49.546989
44	15	10	2024-01-14 12:03:49.551593	2024-01-14 12:03:49.551593
45	15	11	2024-01-14 12:03:49.551593	2024-01-14 12:03:49.551593
46	15	13	2024-01-14 12:03:49.551593	2024-01-14 12:03:49.551593
47	16	10	2024-01-14 12:03:49.554789	2024-01-14 12:03:49.554789
48	16	11	2024-01-14 12:03:49.554789	2024-01-14 12:03:49.554789
49	16	12	2024-01-14 12:03:49.554789	2024-01-14 12:03:49.554789
50	17	10	2024-01-14 12:03:49.55899	2024-01-14 12:03:49.55899
51	17	11	2024-01-14 12:03:49.55899	2024-01-14 12:03:49.55899
52	17	12	2024-01-14 12:03:49.55899	2024-01-14 12:03:49.55899
53	18	10	2024-01-14 12:03:49.562009	2024-01-14 12:03:49.562009
54	18	11	2024-01-14 12:03:49.562009	2024-01-14 12:03:49.562009
55	18	12	2024-01-14 12:03:49.562009	2024-01-14 12:03:49.562009
56	19	10	2024-01-14 12:03:49.566453	2024-01-14 12:03:49.566453
57	19	14	2024-01-14 12:03:49.566453	2024-01-14 12:03:49.566453
58	19	15	2024-01-14 12:03:49.566453	2024-01-14 12:03:49.566453
59	20	10	2024-01-14 12:03:49.570322	2024-01-14 12:03:49.570322
60	20	14	2024-01-14 12:03:49.570322	2024-01-14 12:03:49.570322
61	20	15	2024-01-14 12:03:49.570322	2024-01-14 12:03:49.570322
62	21	10	2024-01-14 12:03:49.574146	2024-01-14 12:03:49.574146
63	21	14	2024-01-14 12:03:49.574146	2024-01-14 12:03:49.574146
64	21	15	2024-01-14 12:03:49.574146	2024-01-14 12:03:49.574146
65	22	10	2024-01-14 12:03:49.577253	2024-01-14 12:03:49.577253
66	22	14	2024-01-14 12:03:49.577253	2024-01-14 12:03:49.577253
67	22	16	2024-01-14 12:03:49.577253	2024-01-14 12:03:49.577253
68	23	10	2024-01-14 12:03:49.587799	2024-01-14 12:03:49.587799
69	23	14	2024-01-14 12:03:49.587799	2024-01-14 12:03:49.587799
70	23	16	2024-01-14 12:03:49.587799	2024-01-14 12:03:49.587799
\.


--
-- Data for Name: product_variant_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_options (id, product_variant_id, product_option_value_id, updated_at, created_at) FROM stdin;
1	1	11	2024-01-14 12:03:49.47925	2024-01-14 12:03:49.47925
2	1	16	2024-01-14 12:03:49.47925	2024-01-14 12:03:49.47925
3	2	11	2024-01-14 12:03:49.480298	2024-01-14 12:03:49.480298
4	2	17	2024-01-14 12:03:49.480298	2024-01-14 12:03:49.480298
5	3	11	2024-01-14 12:03:49.480943	2024-01-14 12:03:49.480943
6	3	18	2024-01-14 12:03:49.480943	2024-01-14 12:03:49.480943
7	4	11	2024-01-14 12:03:49.481566	2024-01-14 12:03:49.481566
8	4	19	2024-01-14 12:03:49.481566	2024-01-14 12:03:49.481566
9	5	9	2024-01-14 12:03:49.482148	2024-01-14 12:03:49.482148
10	5	16	2024-01-14 12:03:49.482148	2024-01-14 12:03:49.482148
11	6	9	2024-01-14 12:03:49.482704	2024-01-14 12:03:49.482704
12	6	17	2024-01-14 12:03:49.482704	2024-01-14 12:03:49.482704
13	7	9	2024-01-14 12:03:49.483289	2024-01-14 12:03:49.483289
14	7	18	2024-01-14 12:03:49.483289	2024-01-14 12:03:49.483289
15	8	9	2024-01-14 12:03:49.483928	2024-01-14 12:03:49.483928
16	8	19	2024-01-14 12:03:49.483928	2024-01-14 12:03:49.483928
17	9	9	2024-01-14 12:03:49.48547	2024-01-14 12:03:49.48547
18	9	16	2024-01-14 12:03:49.48547	2024-01-14 12:03:49.48547
19	10	9	2024-01-14 12:03:49.48617	2024-01-14 12:03:49.48617
20	10	17	2024-01-14 12:03:49.48617	2024-01-14 12:03:49.48617
21	11	9	2024-01-14 12:03:49.486745	2024-01-14 12:03:49.486745
22	11	18	2024-01-14 12:03:49.486745	2024-01-14 12:03:49.486745
23	12	9	2024-01-14 12:03:49.48729	2024-01-14 12:03:49.48729
24	12	19	2024-01-14 12:03:49.48729	2024-01-14 12:03:49.48729
25	13	12	2024-01-14 12:03:49.487788	2024-01-14 12:03:49.487788
26	13	16	2024-01-14 12:03:49.487788	2024-01-14 12:03:49.487788
27	14	12	2024-01-14 12:03:49.488278	2024-01-14 12:03:49.488278
28	14	17	2024-01-14 12:03:49.488278	2024-01-14 12:03:49.488278
29	15	12	2024-01-14 12:03:49.489116	2024-01-14 12:03:49.489116
30	15	18	2024-01-14 12:03:49.489116	2024-01-14 12:03:49.489116
31	16	12	2024-01-14 12:03:49.489673	2024-01-14 12:03:49.489673
32	16	19	2024-01-14 12:03:49.489673	2024-01-14 12:03:49.489673
33	17	10	2024-01-14 12:03:49.490268	2024-01-14 12:03:49.490268
34	17	16	2024-01-14 12:03:49.490268	2024-01-14 12:03:49.490268
35	18	10	2024-01-14 12:03:49.491004	2024-01-14 12:03:49.491004
36	18	17	2024-01-14 12:03:49.491004	2024-01-14 12:03:49.491004
37	19	10	2024-01-14 12:03:49.491537	2024-01-14 12:03:49.491537
38	19	18	2024-01-14 12:03:49.491537	2024-01-14 12:03:49.491537
39	20	10	2024-01-14 12:03:49.492048	2024-01-14 12:03:49.492048
40	20	19	2024-01-14 12:03:49.492048	2024-01-14 12:03:49.492048
41	21	11	2024-01-14 12:03:49.493629	2024-01-14 12:03:49.493629
42	21	16	2024-01-14 12:03:49.493629	2024-01-14 12:03:49.493629
43	22	11	2024-01-14 12:03:49.494131	2024-01-14 12:03:49.494131
44	22	17	2024-01-14 12:03:49.494131	2024-01-14 12:03:49.494131
45	23	11	2024-01-14 12:03:49.494613	2024-01-14 12:03:49.494613
46	23	18	2024-01-14 12:03:49.494613	2024-01-14 12:03:49.494613
47	24	11	2024-01-14 12:03:49.495215	2024-01-14 12:03:49.495215
48	24	19	2024-01-14 12:03:49.495215	2024-01-14 12:03:49.495215
49	25	12	2024-01-14 12:03:49.495717	2024-01-14 12:03:49.495717
50	25	16	2024-01-14 12:03:49.495717	2024-01-14 12:03:49.495717
51	26	12	2024-01-14 12:03:49.496215	2024-01-14 12:03:49.496215
52	26	17	2024-01-14 12:03:49.496215	2024-01-14 12:03:49.496215
53	27	12	2024-01-14 12:03:49.496698	2024-01-14 12:03:49.496698
54	27	18	2024-01-14 12:03:49.496698	2024-01-14 12:03:49.496698
55	28	12	2024-01-14 12:03:49.497185	2024-01-14 12:03:49.497185
56	28	19	2024-01-14 12:03:49.497185	2024-01-14 12:03:49.497185
57	29	10	2024-01-14 12:03:49.497759	2024-01-14 12:03:49.497759
58	29	16	2024-01-14 12:03:49.497759	2024-01-14 12:03:49.497759
59	30	10	2024-01-14 12:03:49.49819	2024-01-14 12:03:49.49819
60	30	17	2024-01-14 12:03:49.49819	2024-01-14 12:03:49.49819
61	31	10	2024-01-14 12:03:49.498682	2024-01-14 12:03:49.498682
62	31	18	2024-01-14 12:03:49.498682	2024-01-14 12:03:49.498682
63	32	10	2024-01-14 12:03:49.499157	2024-01-14 12:03:49.499157
64	32	19	2024-01-14 12:03:49.499157	2024-01-14 12:03:49.499157
65	33	12	2024-01-14 12:03:49.500525	2024-01-14 12:03:49.500525
66	33	16	2024-01-14 12:03:49.500525	2024-01-14 12:03:49.500525
67	34	12	2024-01-14 12:03:49.501056	2024-01-14 12:03:49.501056
68	34	17	2024-01-14 12:03:49.501056	2024-01-14 12:03:49.501056
69	35	12	2024-01-14 12:03:49.501711	2024-01-14 12:03:49.501711
70	35	18	2024-01-14 12:03:49.501711	2024-01-14 12:03:49.501711
71	36	12	2024-01-14 12:03:49.502168	2024-01-14 12:03:49.502168
72	36	19	2024-01-14 12:03:49.502168	2024-01-14 12:03:49.502168
73	37	9	2024-01-14 12:03:49.502582	2024-01-14 12:03:49.502582
74	37	16	2024-01-14 12:03:49.502582	2024-01-14 12:03:49.502582
75	38	9	2024-01-14 12:03:49.502984	2024-01-14 12:03:49.502984
76	38	17	2024-01-14 12:03:49.502984	2024-01-14 12:03:49.502984
77	39	9	2024-01-14 12:03:49.503404	2024-01-14 12:03:49.503404
78	39	18	2024-01-14 12:03:49.503404	2024-01-14 12:03:49.503404
79	40	9	2024-01-14 12:03:49.50382	2024-01-14 12:03:49.50382
80	40	19	2024-01-14 12:03:49.50382	2024-01-14 12:03:49.50382
81	41	9	2024-01-14 12:03:49.505204	2024-01-14 12:03:49.505204
82	41	16	2024-01-14 12:03:49.505204	2024-01-14 12:03:49.505204
83	42	9	2024-01-14 12:03:49.505608	2024-01-14 12:03:49.505608
84	42	17	2024-01-14 12:03:49.505608	2024-01-14 12:03:49.505608
85	43	9	2024-01-14 12:03:49.505998	2024-01-14 12:03:49.505998
86	43	18	2024-01-14 12:03:49.505998	2024-01-14 12:03:49.505998
87	44	9	2024-01-14 12:03:49.506394	2024-01-14 12:03:49.506394
88	44	19	2024-01-14 12:03:49.506394	2024-01-14 12:03:49.506394
89	45	12	2024-01-14 12:03:49.506797	2024-01-14 12:03:49.506797
90	45	17	2024-01-14 12:03:49.506797	2024-01-14 12:03:49.506797
91	46	12	2024-01-14 12:03:49.507201	2024-01-14 12:03:49.507201
92	46	18	2024-01-14 12:03:49.507201	2024-01-14 12:03:49.507201
93	47	12	2024-01-14 12:03:49.507679	2024-01-14 12:03:49.507679
94	47	19	2024-01-14 12:03:49.507679	2024-01-14 12:03:49.507679
95	48	11	2024-01-14 12:03:49.508853	2024-01-14 12:03:49.508853
96	48	16	2024-01-14 12:03:49.508853	2024-01-14 12:03:49.508853
97	49	11	2024-01-14 12:03:49.50925	2024-01-14 12:03:49.50925
98	49	17	2024-01-14 12:03:49.50925	2024-01-14 12:03:49.50925
99	50	11	2024-01-14 12:03:49.509638	2024-01-14 12:03:49.509638
100	50	18	2024-01-14 12:03:49.509638	2024-01-14 12:03:49.509638
101	51	11	2024-01-14 12:03:49.510033	2024-01-14 12:03:49.510033
102	51	19	2024-01-14 12:03:49.510033	2024-01-14 12:03:49.510033
103	52	9	2024-01-14 12:03:49.510426	2024-01-14 12:03:49.510426
104	52	16	2024-01-14 12:03:49.510426	2024-01-14 12:03:49.510426
105	53	9	2024-01-14 12:03:49.510831	2024-01-14 12:03:49.510831
106	53	17	2024-01-14 12:03:49.510831	2024-01-14 12:03:49.510831
107	54	9	2024-01-14 12:03:49.511433	2024-01-14 12:03:49.511433
108	54	18	2024-01-14 12:03:49.511433	2024-01-14 12:03:49.511433
109	55	9	2024-01-14 12:03:49.511944	2024-01-14 12:03:49.511944
110	55	19	2024-01-14 12:03:49.511944	2024-01-14 12:03:49.511944
111	56	3	2024-01-14 12:03:49.513267	2024-01-14 12:03:49.513267
112	56	16	2024-01-14 12:03:49.513267	2024-01-14 12:03:49.513267
113	57	3	2024-01-14 12:03:49.513729	2024-01-14 12:03:49.513729
114	57	17	2024-01-14 12:03:49.513729	2024-01-14 12:03:49.513729
115	58	3	2024-01-14 12:03:49.514162	2024-01-14 12:03:49.514162
116	58	18	2024-01-14 12:03:49.514162	2024-01-14 12:03:49.514162
117	59	3	2024-01-14 12:03:49.514619	2024-01-14 12:03:49.514619
118	59	19	2024-01-14 12:03:49.514619	2024-01-14 12:03:49.514619
119	60	4	2024-01-14 12:03:49.515846	2024-01-14 12:03:49.515846
120	60	16	2024-01-14 12:03:49.515846	2024-01-14 12:03:49.515846
121	61	4	2024-01-14 12:03:49.516345	2024-01-14 12:03:49.516345
122	61	17	2024-01-14 12:03:49.516345	2024-01-14 12:03:49.516345
123	62	4	2024-01-14 12:03:49.516914	2024-01-14 12:03:49.516914
124	62	18	2024-01-14 12:03:49.516914	2024-01-14 12:03:49.516914
125	63	4	2024-01-14 12:03:49.517831	2024-01-14 12:03:49.517831
126	63	19	2024-01-14 12:03:49.517831	2024-01-14 12:03:49.517831
127	64	5	2024-01-14 12:03:49.51925	2024-01-14 12:03:49.51925
128	64	20	2024-01-14 12:03:49.51925	2024-01-14 12:03:49.51925
129	65	5	2024-01-14 12:03:49.519983	2024-01-14 12:03:49.519983
130	65	21	2024-01-14 12:03:49.519983	2024-01-14 12:03:49.519983
131	66	5	2024-01-14 12:03:49.520512	2024-01-14 12:03:49.520512
132	66	22	2024-01-14 12:03:49.520512	2024-01-14 12:03:49.520512
133	67	5	2024-01-14 12:03:49.521202	2024-01-14 12:03:49.521202
134	67	23	2024-01-14 12:03:49.521202	2024-01-14 12:03:49.521202
135	68	5	2024-01-14 12:03:49.521693	2024-01-14 12:03:49.521693
136	68	24	2024-01-14 12:03:49.521693	2024-01-14 12:03:49.521693
137	69	6	2024-01-14 12:03:49.522231	2024-01-14 12:03:49.522231
138	69	20	2024-01-14 12:03:49.522231	2024-01-14 12:03:49.522231
139	70	6	2024-01-14 12:03:49.52299	2024-01-14 12:03:49.52299
140	70	21	2024-01-14 12:03:49.52299	2024-01-14 12:03:49.52299
141	71	6	2024-01-14 12:03:49.523473	2024-01-14 12:03:49.523473
142	71	22	2024-01-14 12:03:49.523473	2024-01-14 12:03:49.523473
143	72	6	2024-01-14 12:03:49.523938	2024-01-14 12:03:49.523938
144	72	23	2024-01-14 12:03:49.523938	2024-01-14 12:03:49.523938
145	73	6	2024-01-14 12:03:49.524401	2024-01-14 12:03:49.524401
146	73	24	2024-01-14 12:03:49.524401	2024-01-14 12:03:49.524401
147	74	5	2024-01-14 12:03:49.525754	2024-01-14 12:03:49.525754
148	74	20	2024-01-14 12:03:49.525754	2024-01-14 12:03:49.525754
149	75	5	2024-01-14 12:03:49.52632	2024-01-14 12:03:49.52632
150	75	21	2024-01-14 12:03:49.52632	2024-01-14 12:03:49.52632
151	76	5	2024-01-14 12:03:49.526851	2024-01-14 12:03:49.526851
152	76	22	2024-01-14 12:03:49.526851	2024-01-14 12:03:49.526851
153	77	5	2024-01-14 12:03:49.527369	2024-01-14 12:03:49.527369
154	77	23	2024-01-14 12:03:49.527369	2024-01-14 12:03:49.527369
155	78	5	2024-01-14 12:03:49.52802	2024-01-14 12:03:49.52802
156	78	24	2024-01-14 12:03:49.52802	2024-01-14 12:03:49.52802
157	79	6	2024-01-14 12:03:49.528465	2024-01-14 12:03:49.528465
158	79	21	2024-01-14 12:03:49.528465	2024-01-14 12:03:49.528465
159	80	6	2024-01-14 12:03:49.528896	2024-01-14 12:03:49.528896
160	80	22	2024-01-14 12:03:49.528896	2024-01-14 12:03:49.528896
161	81	6	2024-01-14 12:03:49.529326	2024-01-14 12:03:49.529326
162	81	23	2024-01-14 12:03:49.529326	2024-01-14 12:03:49.529326
163	82	5	2024-01-14 12:03:49.530778	2024-01-14 12:03:49.530778
164	82	20	2024-01-14 12:03:49.530778	2024-01-14 12:03:49.530778
165	83	5	2024-01-14 12:03:49.531201	2024-01-14 12:03:49.531201
166	83	21	2024-01-14 12:03:49.531201	2024-01-14 12:03:49.531201
167	84	5	2024-01-14 12:03:49.531645	2024-01-14 12:03:49.531645
168	84	22	2024-01-14 12:03:49.531645	2024-01-14 12:03:49.531645
169	85	5	2024-01-14 12:03:49.532075	2024-01-14 12:03:49.532075
170	85	23	2024-01-14 12:03:49.532075	2024-01-14 12:03:49.532075
171	86	6	2024-01-14 12:03:49.532489	2024-01-14 12:03:49.532489
172	86	20	2024-01-14 12:03:49.532489	2024-01-14 12:03:49.532489
173	87	6	2024-01-14 12:03:49.532926	2024-01-14 12:03:49.532926
174	87	21	2024-01-14 12:03:49.532926	2024-01-14 12:03:49.532926
175	88	6	2024-01-14 12:03:49.533621	2024-01-14 12:03:49.533621
176	88	22	2024-01-14 12:03:49.533621	2024-01-14 12:03:49.533621
177	89	6	2024-01-14 12:03:49.534138	2024-01-14 12:03:49.534138
178	89	23	2024-01-14 12:03:49.534138	2024-01-14 12:03:49.534138
179	90	7	2024-01-14 12:03:49.534715	2024-01-14 12:03:49.534715
180	90	20	2024-01-14 12:03:49.534715	2024-01-14 12:03:49.534715
181	91	7	2024-01-14 12:03:49.535489	2024-01-14 12:03:49.535489
182	91	21	2024-01-14 12:03:49.535489	2024-01-14 12:03:49.535489
183	92	7	2024-01-14 12:03:49.536097	2024-01-14 12:03:49.536097
184	92	22	2024-01-14 12:03:49.536097	2024-01-14 12:03:49.536097
185	93	7	2024-01-14 12:03:49.53657	2024-01-14 12:03:49.53657
186	93	23	2024-01-14 12:03:49.53657	2024-01-14 12:03:49.53657
187	94	5	2024-01-14 12:03:49.537744	2024-01-14 12:03:49.537744
188	94	22	2024-01-14 12:03:49.537744	2024-01-14 12:03:49.537744
189	95	5	2024-01-14 12:03:49.538411	2024-01-14 12:03:49.538411
190	95	23	2024-01-14 12:03:49.538411	2024-01-14 12:03:49.538411
191	96	5	2024-01-14 12:03:49.538909	2024-01-14 12:03:49.538909
192	96	24	2024-01-14 12:03:49.538909	2024-01-14 12:03:49.538909
193	97	6	2024-01-14 12:03:49.539351	2024-01-14 12:03:49.539351
194	97	22	2024-01-14 12:03:49.539351	2024-01-14 12:03:49.539351
195	98	6	2024-01-14 12:03:49.539774	2024-01-14 12:03:49.539774
196	98	23	2024-01-14 12:03:49.539774	2024-01-14 12:03:49.539774
197	99	6	2024-01-14 12:03:49.540205	2024-01-14 12:03:49.540205
198	99	24	2024-01-14 12:03:49.540205	2024-01-14 12:03:49.540205
199	100	7	2024-01-14 12:03:49.540728	2024-01-14 12:03:49.540728
200	100	22	2024-01-14 12:03:49.540728	2024-01-14 12:03:49.540728
201	101	7	2024-01-14 12:03:49.541273	2024-01-14 12:03:49.541273
202	101	23	2024-01-14 12:03:49.541273	2024-01-14 12:03:49.541273
203	102	7	2024-01-14 12:03:49.541807	2024-01-14 12:03:49.541807
204	102	24	2024-01-14 12:03:49.541807	2024-01-14 12:03:49.541807
205	103	12	2024-01-14 12:03:49.543426	2024-01-14 12:03:49.543426
206	103	16	2024-01-14 12:03:49.543426	2024-01-14 12:03:49.543426
207	104	12	2024-01-14 12:03:49.543878	2024-01-14 12:03:49.543878
208	104	17	2024-01-14 12:03:49.543878	2024-01-14 12:03:49.543878
209	105	12	2024-01-14 12:03:49.544314	2024-01-14 12:03:49.544314
210	105	18	2024-01-14 12:03:49.544314	2024-01-14 12:03:49.544314
211	106	12	2024-01-14 12:03:49.544755	2024-01-14 12:03:49.544755
212	106	19	2024-01-14 12:03:49.544755	2024-01-14 12:03:49.544755
213	107	9	2024-01-14 12:03:49.545191	2024-01-14 12:03:49.545191
214	107	16	2024-01-14 12:03:49.545191	2024-01-14 12:03:49.545191
215	108	9	2024-01-14 12:03:49.545618	2024-01-14 12:03:49.545618
216	108	17	2024-01-14 12:03:49.545618	2024-01-14 12:03:49.545618
217	109	9	2024-01-14 12:03:49.54605	2024-01-14 12:03:49.54605
218	109	18	2024-01-14 12:03:49.54605	2024-01-14 12:03:49.54605
219	110	9	2024-01-14 12:03:49.546473	2024-01-14 12:03:49.546473
220	110	19	2024-01-14 12:03:49.546473	2024-01-14 12:03:49.546473
221	111	12	2024-01-14 12:03:49.547645	2024-01-14 12:03:49.547645
222	111	16	2024-01-14 12:03:49.547645	2024-01-14 12:03:49.547645
223	112	12	2024-01-14 12:03:49.548163	2024-01-14 12:03:49.548163
224	112	17	2024-01-14 12:03:49.548163	2024-01-14 12:03:49.548163
225	113	12	2024-01-14 12:03:49.548703	2024-01-14 12:03:49.548703
226	113	18	2024-01-14 12:03:49.548703	2024-01-14 12:03:49.548703
227	114	12	2024-01-14 12:03:49.549122	2024-01-14 12:03:49.549122
228	114	19	2024-01-14 12:03:49.549122	2024-01-14 12:03:49.549122
229	115	9	2024-01-14 12:03:49.549527	2024-01-14 12:03:49.549527
230	115	16	2024-01-14 12:03:49.549527	2024-01-14 12:03:49.549527
231	116	9	2024-01-14 12:03:49.550153	2024-01-14 12:03:49.550153
232	116	17	2024-01-14 12:03:49.550153	2024-01-14 12:03:49.550153
233	117	9	2024-01-14 12:03:49.550684	2024-01-14 12:03:49.550684
234	117	18	2024-01-14 12:03:49.550684	2024-01-14 12:03:49.550684
235	118	9	2024-01-14 12:03:49.551128	2024-01-14 12:03:49.551128
236	118	19	2024-01-14 12:03:49.551128	2024-01-14 12:03:49.551128
237	119	9	2024-01-14 12:03:49.552464	2024-01-14 12:03:49.552464
238	119	16	2024-01-14 12:03:49.552464	2024-01-14 12:03:49.552464
239	120	9	2024-01-14 12:03:49.553314	2024-01-14 12:03:49.553314
240	120	17	2024-01-14 12:03:49.553314	2024-01-14 12:03:49.553314
241	121	9	2024-01-14 12:03:49.553809	2024-01-14 12:03:49.553809
242	121	18	2024-01-14 12:03:49.553809	2024-01-14 12:03:49.553809
243	122	9	2024-01-14 12:03:49.554255	2024-01-14 12:03:49.554255
244	122	19	2024-01-14 12:03:49.554255	2024-01-14 12:03:49.554255
245	123	12	2024-01-14 12:03:49.555487	2024-01-14 12:03:49.555487
246	123	16	2024-01-14 12:03:49.555487	2024-01-14 12:03:49.555487
247	124	12	2024-01-14 12:03:49.55597	2024-01-14 12:03:49.55597
248	124	17	2024-01-14 12:03:49.55597	2024-01-14 12:03:49.55597
249	125	12	2024-01-14 12:03:49.556561	2024-01-14 12:03:49.556561
250	125	18	2024-01-14 12:03:49.556561	2024-01-14 12:03:49.556561
251	126	9	2024-01-14 12:03:49.557029	2024-01-14 12:03:49.557029
252	126	16	2024-01-14 12:03:49.557029	2024-01-14 12:03:49.557029
253	127	9	2024-01-14 12:03:49.557473	2024-01-14 12:03:49.557473
254	127	17	2024-01-14 12:03:49.557473	2024-01-14 12:03:49.557473
255	128	9	2024-01-14 12:03:49.558093	2024-01-14 12:03:49.558093
256	128	18	2024-01-14 12:03:49.558093	2024-01-14 12:03:49.558093
257	129	9	2024-01-14 12:03:49.558539	2024-01-14 12:03:49.558539
258	129	19	2024-01-14 12:03:49.558539	2024-01-14 12:03:49.558539
259	130	10	2024-01-14 12:03:49.559651	2024-01-14 12:03:49.559651
260	130	16	2024-01-14 12:03:49.559651	2024-01-14 12:03:49.559651
261	131	10	2024-01-14 12:03:49.560102	2024-01-14 12:03:49.560102
262	131	17	2024-01-14 12:03:49.560102	2024-01-14 12:03:49.560102
263	132	10	2024-01-14 12:03:49.560662	2024-01-14 12:03:49.560662
264	132	18	2024-01-14 12:03:49.560662	2024-01-14 12:03:49.560662
265	133	9	2024-01-14 12:03:49.561121	2024-01-14 12:03:49.561121
266	133	16	2024-01-14 12:03:49.561121	2024-01-14 12:03:49.561121
267	134	9	2024-01-14 12:03:49.561566	2024-01-14 12:03:49.561566
268	134	17	2024-01-14 12:03:49.561566	2024-01-14 12:03:49.561566
269	135	8	2024-01-14 12:03:49.562785	2024-01-14 12:03:49.562785
270	135	16	2024-01-14 12:03:49.562785	2024-01-14 12:03:49.562785
271	136	8	2024-01-14 12:03:49.56345	2024-01-14 12:03:49.56345
272	136	17	2024-01-14 12:03:49.56345	2024-01-14 12:03:49.56345
273	137	8	2024-01-14 12:03:49.563897	2024-01-14 12:03:49.563897
274	137	18	2024-01-14 12:03:49.563897	2024-01-14 12:03:49.563897
275	138	8	2024-01-14 12:03:49.564358	2024-01-14 12:03:49.564358
276	138	19	2024-01-14 12:03:49.564358	2024-01-14 12:03:49.564358
277	139	9	2024-01-14 12:03:49.564806	2024-01-14 12:03:49.564806
278	139	17	2024-01-14 12:03:49.564806	2024-01-14 12:03:49.564806
279	140	9	2024-01-14 12:03:49.565532	2024-01-14 12:03:49.565532
280	140	18	2024-01-14 12:03:49.565532	2024-01-14 12:03:49.565532
281	141	9	2024-01-14 12:03:49.565999	2024-01-14 12:03:49.565999
282	141	19	2024-01-14 12:03:49.565999	2024-01-14 12:03:49.565999
283	142	1	2024-01-14 12:03:49.56862	2024-01-14 12:03:49.56862
284	142	17	2024-01-14 12:03:49.56862	2024-01-14 12:03:49.56862
285	143	1	2024-01-14 12:03:49.569134	2024-01-14 12:03:49.569134
286	143	18	2024-01-14 12:03:49.569134	2024-01-14 12:03:49.569134
287	144	1	2024-01-14 12:03:49.569683	2024-01-14 12:03:49.569683
288	144	19	2024-01-14 12:03:49.569683	2024-01-14 12:03:49.569683
289	145	1	2024-01-14 12:03:49.571137	2024-01-14 12:03:49.571137
290	145	16	2024-01-14 12:03:49.571137	2024-01-14 12:03:49.571137
291	146	1	2024-01-14 12:03:49.571586	2024-01-14 12:03:49.571586
292	146	17	2024-01-14 12:03:49.571586	2024-01-14 12:03:49.571586
293	147	1	2024-01-14 12:03:49.572097	2024-01-14 12:03:49.572097
294	147	18	2024-01-14 12:03:49.572097	2024-01-14 12:03:49.572097
295	148	2	2024-01-14 12:03:49.572584	2024-01-14 12:03:49.572584
296	148	16	2024-01-14 12:03:49.572584	2024-01-14 12:03:49.572584
297	149	2	2024-01-14 12:03:49.573171	2024-01-14 12:03:49.573171
298	149	17	2024-01-14 12:03:49.573171	2024-01-14 12:03:49.573171
299	150	2	2024-01-14 12:03:49.573686	2024-01-14 12:03:49.573686
300	150	18	2024-01-14 12:03:49.573686	2024-01-14 12:03:49.573686
301	151	2	2024-01-14 12:03:49.575106	2024-01-14 12:03:49.575106
302	151	16	2024-01-14 12:03:49.575106	2024-01-14 12:03:49.575106
303	152	2	2024-01-14 12:03:49.57564	2024-01-14 12:03:49.57564
304	152	17	2024-01-14 12:03:49.57564	2024-01-14 12:03:49.57564
305	153	2	2024-01-14 12:03:49.576251	2024-01-14 12:03:49.576251
306	153	18	2024-01-14 12:03:49.576251	2024-01-14 12:03:49.576251
307	154	2	2024-01-14 12:03:49.576715	2024-01-14 12:03:49.576715
308	154	19	2024-01-14 12:03:49.576715	2024-01-14 12:03:49.576715
309	155	5	2024-01-14 12:03:49.578131	2024-01-14 12:03:49.578131
310	155	25	2024-01-14 12:03:49.578131	2024-01-14 12:03:49.578131
311	156	5	2024-01-14 12:03:49.578631	2024-01-14 12:03:49.578631
312	156	26	2024-01-14 12:03:49.578631	2024-01-14 12:03:49.578631
313	157	5	2024-01-14 12:03:49.57912	2024-01-14 12:03:49.57912
314	157	27	2024-01-14 12:03:49.57912	2024-01-14 12:03:49.57912
315	158	5	2024-01-14 12:03:49.579555	2024-01-14 12:03:49.579555
316	158	28	2024-01-14 12:03:49.579555	2024-01-14 12:03:49.579555
317	159	5	2024-01-14 12:03:49.580004	2024-01-14 12:03:49.580004
318	159	29	2024-01-14 12:03:49.580004	2024-01-14 12:03:49.580004
319	160	5	2024-01-14 12:03:49.580428	2024-01-14 12:03:49.580428
320	160	20	2024-01-14 12:03:49.580428	2024-01-14 12:03:49.580428
321	161	5	2024-01-14 12:03:49.580833	2024-01-14 12:03:49.580833
322	161	21	2024-01-14 12:03:49.580833	2024-01-14 12:03:49.580833
323	162	5	2024-01-14 12:03:49.58125	2024-01-14 12:03:49.58125
324	162	22	2024-01-14 12:03:49.58125	2024-01-14 12:03:49.58125
325	163	5	2024-01-14 12:03:49.581915	2024-01-14 12:03:49.581915
326	163	23	2024-01-14 12:03:49.581915	2024-01-14 12:03:49.581915
327	164	5	2024-01-14 12:03:49.582428	2024-01-14 12:03:49.582428
328	164	24	2024-01-14 12:03:49.582428	2024-01-14 12:03:49.582428
329	165	6	2024-01-14 12:03:49.582831	2024-01-14 12:03:49.582831
330	165	25	2024-01-14 12:03:49.582831	2024-01-14 12:03:49.582831
331	166	6	2024-01-14 12:03:49.583251	2024-01-14 12:03:49.583251
332	166	26	2024-01-14 12:03:49.583251	2024-01-14 12:03:49.583251
333	167	6	2024-01-14 12:03:49.583786	2024-01-14 12:03:49.583786
334	167	27	2024-01-14 12:03:49.583786	2024-01-14 12:03:49.583786
335	168	6	2024-01-14 12:03:49.584378	2024-01-14 12:03:49.584378
336	168	28	2024-01-14 12:03:49.584378	2024-01-14 12:03:49.584378
337	169	6	2024-01-14 12:03:49.584837	2024-01-14 12:03:49.584837
338	169	29	2024-01-14 12:03:49.584837	2024-01-14 12:03:49.584837
339	170	6	2024-01-14 12:03:49.585299	2024-01-14 12:03:49.585299
340	170	20	2024-01-14 12:03:49.585299	2024-01-14 12:03:49.585299
341	171	6	2024-01-14 12:03:49.585714	2024-01-14 12:03:49.585714
342	171	21	2024-01-14 12:03:49.585714	2024-01-14 12:03:49.585714
343	172	6	2024-01-14 12:03:49.58618	2024-01-14 12:03:49.58618
344	172	22	2024-01-14 12:03:49.58618	2024-01-14 12:03:49.58618
345	173	6	2024-01-14 12:03:49.586708	2024-01-14 12:03:49.586708
346	173	23	2024-01-14 12:03:49.586708	2024-01-14 12:03:49.586708
347	174	6	2024-01-14 12:03:49.58727	2024-01-14 12:03:49.58727
348	174	24	2024-01-14 12:03:49.58727	2024-01-14 12:03:49.58727
349	175	5	2024-01-14 12:03:49.588567	2024-01-14 12:03:49.588567
350	175	27	2024-01-14 12:03:49.588567	2024-01-14 12:03:49.588567
351	176	5	2024-01-14 12:03:49.589003	2024-01-14 12:03:49.589003
352	176	28	2024-01-14 12:03:49.589003	2024-01-14 12:03:49.589003
353	177	5	2024-01-14 12:03:49.589601	2024-01-14 12:03:49.589601
354	177	29	2024-01-14 12:03:49.589601	2024-01-14 12:03:49.589601
355	178	5	2024-01-14 12:03:49.590073	2024-01-14 12:03:49.590073
356	178	20	2024-01-14 12:03:49.590073	2024-01-14 12:03:49.590073
357	179	5	2024-01-14 12:03:49.590492	2024-01-14 12:03:49.590492
358	179	21	2024-01-14 12:03:49.590492	2024-01-14 12:03:49.590492
359	180	5	2024-01-14 12:03:49.590919	2024-01-14 12:03:49.590919
360	180	22	2024-01-14 12:03:49.590919	2024-01-14 12:03:49.590919
361	181	5	2024-01-14 12:03:49.591466	2024-01-14 12:03:49.591466
362	181	23	2024-01-14 12:03:49.591466	2024-01-14 12:03:49.591466
363	182	5	2024-01-14 12:03:49.592011	2024-01-14 12:03:49.592011
364	182	24	2024-01-14 12:03:49.592011	2024-01-14 12:03:49.592011
365	183	6	2024-01-14 12:03:49.592562	2024-01-14 12:03:49.592562
366	183	29	2024-01-14 12:03:49.592562	2024-01-14 12:03:49.592562
367	184	6	2024-01-14 12:03:49.593092	2024-01-14 12:03:49.593092
368	184	20	2024-01-14 12:03:49.593092	2024-01-14 12:03:49.593092
369	185	6	2024-01-14 12:03:49.5936	2024-01-14 12:03:49.5936
370	185	21	2024-01-14 12:03:49.5936	2024-01-14 12:03:49.5936
371	186	6	2024-01-14 12:03:49.594068	2024-01-14 12:03:49.594068
372	186	22	2024-01-14 12:03:49.594068	2024-01-14 12:03:49.594068
373	187	6	2024-01-14 12:03:49.5947	2024-01-14 12:03:49.5947
374	187	23	2024-01-14 12:03:49.5947	2024-01-14 12:03:49.5947
375	188	6	2024-01-14 12:03:49.595246	2024-01-14 12:03:49.595246
376	188	24	2024-01-14 12:03:49.595246	2024-01-14 12:03:49.595246
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, pricing, variant_name, product_id, "position", product_status, product_variant_image_url, updated_at, created_at) FROM stdin;
1	28.90	Red-S	1	1	ACTIVE	\N	2024-01-14 12:03:49.47874	2024-01-14 12:03:49.47874
2	28.90	Red-M	1	2	ACTIVE	\N	2024-01-14 12:03:49.47999	2024-01-14 12:03:49.47999
3	28.90	Red-L	1	3	ACTIVE	\N	2024-01-14 12:03:49.480648	2024-01-14 12:03:49.480648
4	28.90	Red-XL	1	4	ACTIVE	\N	2024-01-14 12:03:49.481277	2024-01-14 12:03:49.481277
5	28.90	White-S	1	5	ACTIVE	\N	2024-01-14 12:03:49.481878	2024-01-14 12:03:49.481878
6	28.90	White-M	1	6	ACTIVE	\N	2024-01-14 12:03:49.482437	2024-01-14 12:03:49.482437
7	26.90	White-L	1	7	ACTIVE	\N	2024-01-14 12:03:49.482983	2024-01-14 12:03:49.482983
8	26.90	White-XL	1	8	ACTIVE	\N	2024-01-14 12:03:49.483649	2024-01-14 12:03:49.483649
9	30.90	White-S	2	1	ACTIVE	\N	2024-01-14 12:03:49.485182	2024-01-14 12:03:49.485182
10	30.90	White-M	2	2	ACTIVE	\N	2024-01-14 12:03:49.4858	2024-01-14 12:03:49.4858
11	30.90	White-L	2	3	ACTIVE	\N	2024-01-14 12:03:49.486453	2024-01-14 12:03:49.486453
12	30.90	White-XL	2	4	ACTIVE	\N	2024-01-14 12:03:49.487018	2024-01-14 12:03:49.487018
13	32.00	Black-S	2	5	ACTIVE	\N	2024-01-14 12:03:49.487541	2024-01-14 12:03:49.487541
14	32.00	Black-M	2	6	ACTIVE	\N	2024-01-14 12:03:49.488033	2024-01-14 12:03:49.488033
15	32.00	Black-L	2	7	ACTIVE	\N	2024-01-14 12:03:49.488617	2024-01-14 12:03:49.488617
16	32.00	Black-XL	2	8	ACTIVE	\N	2024-01-14 12:03:49.489395	2024-01-14 12:03:49.489395
17	30.90	Grey-S	2	9	ACTIVE	\N	2024-01-14 12:03:49.489933	2024-01-14 12:03:49.489933
18	30.90	Grey-M	2	10	ACTIVE	\N	2024-01-14 12:03:49.490725	2024-01-14 12:03:49.490725
19	30.90	Grey-L	2	11	ACTIVE	\N	2024-01-14 12:03:49.491278	2024-01-14 12:03:49.491278
20	30.90	Grey-XL	2	12	ACTIVE	\N	2024-01-14 12:03:49.491797	2024-01-14 12:03:49.491797
21	34.90	Red-S	3	1	ACTIVE	\N	2024-01-14 12:03:49.493365	2024-01-14 12:03:49.493365
22	34.90	Red-M	3	2	ACTIVE	\N	2024-01-14 12:03:49.493878	2024-01-14 12:03:49.493878
23	34.90	Red-L	3	3	ACTIVE	\N	2024-01-14 12:03:49.494372	2024-01-14 12:03:49.494372
24	34.90	Red-XL	3	4	ACTIVE	\N	2024-01-14 12:03:49.494956	2024-01-14 12:03:49.494956
25	36.70	Black-S	3	5	ACTIVE	\N	2024-01-14 12:03:49.495471	2024-01-14 12:03:49.495471
26	36.70	Black-M	3	6	ACTIVE	\N	2024-01-14 12:03:49.495965	2024-01-14 12:03:49.495965
27	36.70	Black-L	3	7	ACTIVE	\N	2024-01-14 12:03:49.496452	2024-01-14 12:03:49.496452
28	36.70	Black-XL	3	8	ACTIVE	\N	2024-01-14 12:03:49.496961	2024-01-14 12:03:49.496961
29	38.90	Grey-S	3	9	ACTIVE	\N	2024-01-14 12:03:49.497538	2024-01-14 12:03:49.497538
30	40.30	Grey-M	3	10	ACTIVE	\N	2024-01-14 12:03:49.497979	2024-01-14 12:03:49.497979
31	38.90	Grey-L	3	11	ACTIVE	\N	2024-01-14 12:03:49.498445	2024-01-14 12:03:49.498445
32	38.90	Grey-XL	3	12	ACTIVE	\N	2024-01-14 12:03:49.498909	2024-01-14 12:03:49.498909
33	22.50	Black-S	4	1	ACTIVE	\N	2024-01-14 12:03:49.500245	2024-01-14 12:03:49.500245
34	26.40	Black-M	4	2	ACTIVE	\N	2024-01-14 12:03:49.500802	2024-01-14 12:03:49.500802
35	22.50	Black-L	4	3	ACTIVE	\N	2024-01-14 12:03:49.501466	2024-01-14 12:03:49.501466
36	22.50	Black-XL	4	4	ACTIVE	\N	2024-01-14 12:03:49.50195	2024-01-14 12:03:49.50195
37	22.50	White-S	4	5	ACTIVE	\N	2024-01-14 12:03:49.50238	2024-01-14 12:03:49.50238
38	26.40	White-M	4	6	ACTIVE	\N	2024-01-14 12:03:49.502783	2024-01-14 12:03:49.502783
39	22.50	White-L	4	7	ACTIVE	\N	2024-01-14 12:03:49.503203	2024-01-14 12:03:49.503203
40	22.50	White-XL	4	8	ACTIVE	\N	2024-01-14 12:03:49.503616	2024-01-14 12:03:49.503616
41	35.30	White-S	5	1	ACTIVE	\N	2024-01-14 12:03:49.504984	2024-01-14 12:03:49.504984
42	37.80	White-M	5	2	ACTIVE	\N	2024-01-14 12:03:49.505407	2024-01-14 12:03:49.505407
43	35.30	White-L	5	3	ACTIVE	\N	2024-01-14 12:03:49.505805	2024-01-14 12:03:49.505805
44	35.30	White-XL	5	4	ACTIVE	\N	2024-01-14 12:03:49.506198	2024-01-14 12:03:49.506198
45	31.50	Black-M	5	5	ACTIVE	\N	2024-01-14 12:03:49.506595	2024-01-14 12:03:49.506595
46	31.50	Black-L	5	6	ACTIVE	\N	2024-01-14 12:03:49.507001	2024-01-14 12:03:49.507001
47	31.50	Black-XL	5	7	ACTIVE	\N	2024-01-14 12:03:49.507438	2024-01-14 12:03:49.507438
48	20.00	Red-S	6	1	ACTIVE	\N	2024-01-14 12:03:49.508624	2024-01-14 12:03:49.508624
49	22.20	Red-M	6	2	ACTIVE	\N	2024-01-14 12:03:49.50905	2024-01-14 12:03:49.50905
50	20.00	Red-L	6	3	ACTIVE	\N	2024-01-14 12:03:49.509443	2024-01-14 12:03:49.509443
51	20.00	Red-XL	6	4	ACTIVE	\N	2024-01-14 12:03:49.509841	2024-01-14 12:03:49.509841
52	20.00	White-S	6	5	ACTIVE	\N	2024-01-14 12:03:49.510226	2024-01-14 12:03:49.510226
53	22.20	White-M	6	6	ACTIVE	\N	2024-01-14 12:03:49.510622	2024-01-14 12:03:49.510622
54	20.00	White-L	6	7	ACTIVE	\N	2024-01-14 12:03:49.511053	2024-01-14 12:03:49.511053
55	20.00	White-XL	6	8	ACTIVE	\N	2024-01-14 12:03:49.511672	2024-01-14 12:03:49.511672
56	32.00	Brown-S	7	1	ACTIVE	\N	2024-01-14 12:03:49.513027	2024-01-14 12:03:49.513027
57	32.00	Brown-M	7	2	ACTIVE	\N	2024-01-14 12:03:49.513504	2024-01-14 12:03:49.513504
58	32.00	Brown-L	7	3	ACTIVE	\N	2024-01-14 12:03:49.513951	2024-01-14 12:03:49.513951
59	32.00	Brown-XL	7	4	ACTIVE	\N	2024-01-14 12:03:49.514393	2024-01-14 12:03:49.514393
60	15.00	Blue-S	8	1	ACTIVE	\N	2024-01-14 12:03:49.515598	2024-01-14 12:03:49.515598
61	15.00	Blue-M	8	2	ACTIVE	\N	2024-01-14 12:03:49.516101	2024-01-14 12:03:49.516101
62	15.00	Blue-L	8	3	ACTIVE	\N	2024-01-14 12:03:49.516608	2024-01-14 12:03:49.516608
63	15.00	Blue-XL	8	4	ACTIVE	\N	2024-01-14 12:03:49.517459	2024-01-14 12:03:49.517459
64	72.80	Blue-29 inch	9	1	ACTIVE	\N	2024-01-14 12:03:49.518981	2024-01-14 12:03:49.518981
65	72.80	Blue-30 inch	9	2	ACTIVE	\N	2024-01-14 12:03:49.519676	2024-01-14 12:03:49.519676
66	72.80	Blue-31 inch	9	3	ACTIVE	\N	2024-01-14 12:03:49.52024	2024-01-14 12:03:49.52024
67	72.80	Blue-32 inch	9	4	ACTIVE	\N	2024-01-14 12:03:49.520819	2024-01-14 12:03:49.520819
68	72.80	Blue-33 inch	9	5	ACTIVE	\N	2024-01-14 12:03:49.521434	2024-01-14 12:03:49.521434
69	72.80	Navy-29 inch	9	6	ACTIVE	\N	2024-01-14 12:03:49.521995	2024-01-14 12:03:49.521995
70	72.80	Navy-30 inch	9	7	ACTIVE	\N	2024-01-14 12:03:49.522711	2024-01-14 12:03:49.522711
71	72.80	Navy-31 inch	9	8	ACTIVE	\N	2024-01-14 12:03:49.523222	2024-01-14 12:03:49.523222
72	72.80	Navy-32 inch	9	9	ACTIVE	\N	2024-01-14 12:03:49.523688	2024-01-14 12:03:49.523688
73	72.80	Navy-33 inch	9	10	ACTIVE	\N	2024-01-14 12:03:49.524153	2024-01-14 12:03:49.524153
74	59.90	Blue-29 inch	10	1	ACTIVE	\N	2024-01-14 12:03:49.525451	2024-01-14 12:03:49.525451
75	59.90	Blue-30 inch	10	2	ACTIVE	\N	2024-01-14 12:03:49.526043	2024-01-14 12:03:49.526043
76	60.10	Blue-31 inch	10	3	ACTIVE	\N	2024-01-14 12:03:49.526602	2024-01-14 12:03:49.526602
77	59.90	Blue-32 inch	10	4	ACTIVE	\N	2024-01-14 12:03:49.527099	2024-01-14 12:03:49.527099
78	59.90	Blue-33 inch	10	5	ACTIVE	\N	2024-01-14 12:03:49.527795	2024-01-14 12:03:49.527795
79	58.80	Navy-30 inch	10	6	ACTIVE	\N	2024-01-14 12:03:49.528241	2024-01-14 12:03:49.528241
80	58.80	Navy-31 inch	10	7	ACTIVE	\N	2024-01-14 12:03:49.52868	2024-01-14 12:03:49.52868
81	58.80	Navy-32 inch	10	8	ACTIVE	\N	2024-01-14 12:03:49.529104	2024-01-14 12:03:49.529104
82	38.80	Blue-29 inch	11	1	ACTIVE	\N	2024-01-14 12:03:49.530544	2024-01-14 12:03:49.530544
83	40.10	Blue-30 inch	11	2	ACTIVE	\N	2024-01-14 12:03:49.530986	2024-01-14 12:03:49.530986
84	38.80	Blue-31 inch	11	3	ACTIVE	\N	2024-01-14 12:03:49.531423	2024-01-14 12:03:49.531423
85	38.80	Blue-32 inch	11	4	ACTIVE	\N	2024-01-14 12:03:49.531863	2024-01-14 12:03:49.531863
86	37.80	Navy-29 inch	11	5	ACTIVE	\N	2024-01-14 12:03:49.532278	2024-01-14 12:03:49.532278
87	37.80	Navy-30 inch	11	6	ACTIVE	\N	2024-01-14 12:03:49.5327	2024-01-14 12:03:49.5327
88	37.80	Navy-31 inch	11	7	ACTIVE	\N	2024-01-14 12:03:49.533227	2024-01-14 12:03:49.533227
89	37.80	Navy-32 inch	11	8	ACTIVE	\N	2024-01-14 12:03:49.53389	2024-01-14 12:03:49.53389
90	37.80	Natural-29 inch	11	9	ACTIVE	\N	2024-01-14 12:03:49.534421	2024-01-14 12:03:49.534421
91	37.80	Natural-30 inch	11	10	ACTIVE	\N	2024-01-14 12:03:49.535055	2024-01-14 12:03:49.535055
92	37.80	Natural-31 inch	11	11	ACTIVE	\N	2024-01-14 12:03:49.535798	2024-01-14 12:03:49.535798
93	37.80	Natural-32 inch	11	12	ACTIVE	\N	2024-01-14 12:03:49.536342	2024-01-14 12:03:49.536342
94	56.60	Blue-31 inch	12	1	ACTIVE	\N	2024-01-14 12:03:49.537523	2024-01-14 12:03:49.537523
95	56.60	Blue-32 inch	12	2	ACTIVE	\N	2024-01-14 12:03:49.537964	2024-01-14 12:03:49.537964
96	56.60	Blue-33 inch	12	3	ACTIVE	\N	2024-01-14 12:03:49.538631	2024-01-14 12:03:49.538631
97	56.60	Navy-31 inch	12	4	ACTIVE	\N	2024-01-14 12:03:49.539141	2024-01-14 12:03:49.539141
98	56.60	Navy-32 inch	12	5	ACTIVE	\N	2024-01-14 12:03:49.539561	2024-01-14 12:03:49.539561
99	56.60	Navy-33 inch	12	6	ACTIVE	\N	2024-01-14 12:03:49.53999	2024-01-14 12:03:49.53999
100	57.80	Natural-31 inch	12	7	ACTIVE	\N	2024-01-14 12:03:49.540444	2024-01-14 12:03:49.540444
101	57.80	Natural-32 inch	12	8	ACTIVE	\N	2024-01-14 12:03:49.540999	2024-01-14 12:03:49.540999
102	57.80	Natural-33 inch	12	9	ACTIVE	\N	2024-01-14 12:03:49.541516	2024-01-14 12:03:49.541516
103	46.60	Black-S	13	1	ACTIVE	\N	2024-01-14 12:03:49.543184	2024-01-14 12:03:49.543184
104	46.60	Black-M	13	2	ACTIVE	\N	2024-01-14 12:03:49.543661	2024-01-14 12:03:49.543661
105	46.60	Black-L	13	3	ACTIVE	\N	2024-01-14 12:03:49.5441	2024-01-14 12:03:49.5441
106	46.60	Black-XL	13	4	ACTIVE	\N	2024-01-14 12:03:49.544532	2024-01-14 12:03:49.544532
107	46.60	White-S	13	5	ACTIVE	\N	2024-01-14 12:03:49.544975	2024-01-14 12:03:49.544975
108	46.60	White-M	13	6	ACTIVE	\N	2024-01-14 12:03:49.545407	2024-01-14 12:03:49.545407
109	46.60	White-L	13	7	ACTIVE	\N	2024-01-14 12:03:49.545836	2024-01-14 12:03:49.545836
110	46.60	White-XL	13	8	ACTIVE	\N	2024-01-14 12:03:49.546265	2024-01-14 12:03:49.546265
111	65.60	Black-S	14	1	ACTIVE	\N	2024-01-14 12:03:49.547433	2024-01-14 12:03:49.547433
112	68.60	Black-M	14	2	ACTIVE	\N	2024-01-14 12:03:49.547909	2024-01-14 12:03:49.547909
113	65.60	Black-L	14	3	ACTIVE	\N	2024-01-14 12:03:49.548467	2024-01-14 12:03:49.548467
114	65.60	Black-XL	14	4	ACTIVE	\N	2024-01-14 12:03:49.548915	2024-01-14 12:03:49.548915
115	65.60	White-S	14	5	ACTIVE	\N	2024-01-14 12:03:49.549326	2024-01-14 12:03:49.549326
116	68.60	White-M	14	6	ACTIVE	\N	2024-01-14 12:03:49.54973	2024-01-14 12:03:49.54973
117	65.60	White-L	14	7	ACTIVE	\N	2024-01-14 12:03:49.550403	2024-01-14 12:03:49.550403
118	65.60	White-XL	14	8	ACTIVE	\N	2024-01-14 12:03:49.550912	2024-01-14 12:03:49.550912
119	53.80	White-S	15	1	ACTIVE	\N	2024-01-14 12:03:49.552133	2024-01-14 12:03:49.552133
120	53.80	White-M	15	2	ACTIVE	\N	2024-01-14 12:03:49.552956	2024-01-14 12:03:49.552956
121	53.80	White-L	15	3	ACTIVE	\N	2024-01-14 12:03:49.553562	2024-01-14 12:03:49.553562
122	53.80	White-XL	15	4	ACTIVE	\N	2024-01-14 12:03:49.554023	2024-01-14 12:03:49.554023
123	26.70	Black-S	16	1	ACTIVE	\N	2024-01-14 12:03:49.555256	2024-01-14 12:03:49.555256
124	28.90	Black-M	16	2	ACTIVE	\N	2024-01-14 12:03:49.555749	2024-01-14 12:03:49.555749
125	26.70	Black-L	16	3	ACTIVE	\N	2024-01-14 12:03:49.556245	2024-01-14 12:03:49.556245
126	26.70	White-S	16	4	ACTIVE	\N	2024-01-14 12:03:49.556801	2024-01-14 12:03:49.556801
127	28.90	White-M	16	5	ACTIVE	\N	2024-01-14 12:03:49.557262	2024-01-14 12:03:49.557262
128	26.70	White-L	16	6	ACTIVE	\N	2024-01-14 12:03:49.557698	2024-01-14 12:03:49.557698
129	26.70	White-XL	16	7	ACTIVE	\N	2024-01-14 12:03:49.558316	2024-01-14 12:03:49.558316
130	29.50	Grey-S	17	1	ACTIVE	\N	2024-01-14 12:03:49.559442	2024-01-14 12:03:49.559442
131	29.50	Grey-M	17	2	ACTIVE	\N	2024-01-14 12:03:49.559873	2024-01-14 12:03:49.559873
132	29.50	Grey-L	17	3	ACTIVE	\N	2024-01-14 12:03:49.560396	2024-01-14 12:03:49.560396
133	26.70	White-S	17	4	ACTIVE	\N	2024-01-14 12:03:49.560895	2024-01-14 12:03:49.560895
134	26.70	White-M	17	5	ACTIVE	\N	2024-01-14 12:03:49.561357	2024-01-14 12:03:49.561357
135	36.70	Green-S	18	1	ACTIVE	\N	2024-01-14 12:03:49.562546	2024-01-14 12:03:49.562546
136	38.70	Green-M	18	2	ACTIVE	\N	2024-01-14 12:03:49.563189	2024-01-14 12:03:49.563189
137	36.70	Green-L	18	3	ACTIVE	\N	2024-01-14 12:03:49.563674	2024-01-14 12:03:49.563674
138	36.70	Green-XL	18	4	ACTIVE	\N	2024-01-14 12:03:49.564147	2024-01-14 12:03:49.564147
139	38.70	White-M	18	5	ACTIVE	\N	2024-01-14 12:03:49.564578	2024-01-14 12:03:49.564578
140	36.70	White-L	18	6	ACTIVE	\N	2024-01-14 12:03:49.565289	2024-01-14 12:03:49.565289
141	36.70	White-XL	18	7	ACTIVE	\N	2024-01-14 12:03:49.565774	2024-01-14 12:03:49.565774
142	43.30	Red-M	19	1	ACTIVE	\N	2024-01-14 12:03:49.568313	2024-01-14 12:03:49.568313
143	43.30	Red-L	19	2	ACTIVE	\N	2024-01-14 12:03:49.568869	2024-01-14 12:03:49.568869
144	43.30	Red-XL	19	3	ACTIVE	\N	2024-01-14 12:03:49.569389	2024-01-14 12:03:49.569389
145	51.50	Red-S	20	1	ACTIVE	\N	2024-01-14 12:03:49.570902	2024-01-14 12:03:49.570902
146	53.50	Red-M	20	2	ACTIVE	\N	2024-01-14 12:03:49.571357	2024-01-14 12:03:49.571357
147	51.50	Red-L	20	3	ACTIVE	\N	2024-01-14 12:03:49.571804	2024-01-14 12:03:49.571804
148	51.50	Black-S	20	4	ACTIVE	\N	2024-01-14 12:03:49.572324	2024-01-14 12:03:49.572324
149	53.50	Black-M	20	5	ACTIVE	\N	2024-01-14 12:03:49.572814	2024-01-14 12:03:49.572814
150	51.50	Black-L	20	6	ACTIVE	\N	2024-01-14 12:03:49.573424	2024-01-14 12:03:49.573424
151	110.50	Black-S	21	1	ACTIVE	\N	2024-01-14 12:03:49.574777	2024-01-14 12:03:49.574777
152	120.50	Black-M	21	2	ACTIVE	\N	2024-01-14 12:03:49.575373	2024-01-14 12:03:49.575373
153	120.50	Black-L	21	3	ACTIVE	\N	2024-01-14 12:03:49.576017	2024-01-14 12:03:49.576017
154	120.50	Black-XL	21	4	ACTIVE	\N	2024-01-14 12:03:49.576477	2024-01-14 12:03:49.576477
155	62.20	Blue-24 inch	22	1	ACTIVE	\N	2024-01-14 12:03:49.577857	2024-01-14 12:03:49.577857
156	62.20	Blue-25 inch	22	2	ACTIVE	\N	2024-01-14 12:03:49.578403	2024-01-14 12:03:49.578403
157	62.20	Blue-26 inch	22	3	ACTIVE	\N	2024-01-14 12:03:49.57886	2024-01-14 12:03:49.57886
158	62.20	Blue-27 inch	22	4	ACTIVE	\N	2024-01-14 12:03:49.579331	2024-01-14 12:03:49.579331
159	62.20	Blue-28 inch	22	5	ACTIVE	\N	2024-01-14 12:03:49.57979	2024-01-14 12:03:49.57979
160	62.20	Blue-29 inch	22	6	ACTIVE	\N	2024-01-14 12:03:49.580223	2024-01-14 12:03:49.580223
161	62.20	Blue-30 inch	22	7	ACTIVE	\N	2024-01-14 12:03:49.580629	2024-01-14 12:03:49.580629
162	62.20	Blue-31 inch	22	8	ACTIVE	\N	2024-01-14 12:03:49.581045	2024-01-14 12:03:49.581045
163	62.20	Blue-32 inch	22	9	ACTIVE	\N	2024-01-14 12:03:49.581466	2024-01-14 12:03:49.581466
164	62.20	Blue-33 inch	22	10	ACTIVE	\N	2024-01-14 12:03:49.582208	2024-01-14 12:03:49.582208
165	63.30	Navy-24 inch	22	11	ACTIVE	\N	2024-01-14 12:03:49.582625	2024-01-14 12:03:49.582625
166	63.30	Navy-25 inch	22	12	ACTIVE	\N	2024-01-14 12:03:49.58303	2024-01-14 12:03:49.58303
167	63.30	Navy-26 inch	22	13	ACTIVE	\N	2024-01-14 12:03:49.583502	2024-01-14 12:03:49.583502
168	63.30	Navy-27 inch	22	14	ACTIVE	\N	2024-01-14 12:03:49.584076	2024-01-14 12:03:49.584076
169	63.30	Navy-28 inch	22	15	ACTIVE	\N	2024-01-14 12:03:49.584622	2024-01-14 12:03:49.584622
170	63.30	Navy-29 inch	22	16	ACTIVE	\N	2024-01-14 12:03:49.585061	2024-01-14 12:03:49.585061
171	63.30	Navy-30 inch	22	17	ACTIVE	\N	2024-01-14 12:03:49.585511	2024-01-14 12:03:49.585511
172	63.30	Navy-31 inch	22	18	ACTIVE	\N	2024-01-14 12:03:49.585956	2024-01-14 12:03:49.585956
173	63.30	Navy-32 inch	22	19	ACTIVE	\N	2024-01-14 12:03:49.586385	2024-01-14 12:03:49.586385
174	63.30	Navy-33 inch	22	20	ACTIVE	\N	2024-01-14 12:03:49.58697	2024-01-14 12:03:49.58697
175	68.70	Blue-26 inch	23	1	ACTIVE	\N	2024-01-14 12:03:49.588305	2024-01-14 12:03:49.588305
176	68.70	Blue-27 inch	23	2	ACTIVE	\N	2024-01-14 12:03:49.588795	2024-01-14 12:03:49.588795
177	68.70	Blue-28 inch	23	3	ACTIVE	\N	2024-01-14 12:03:49.589389	2024-01-14 12:03:49.589389
178	68.70	Blue-29 inch	23	4	ACTIVE	\N	2024-01-14 12:03:49.589859	2024-01-14 12:03:49.589859
179	68.70	Blue-30 inch	23	5	ACTIVE	\N	2024-01-14 12:03:49.590284	2024-01-14 12:03:49.590284
180	68.70	Blue-31 inch	23	6	ACTIVE	\N	2024-01-14 12:03:49.590714	2024-01-14 12:03:49.590714
181	68.70	Blue-32 inch	23	7	ACTIVE	\N	2024-01-14 12:03:49.591124	2024-01-14 12:03:49.591124
182	68.70	Blue-33 inch	23	8	ACTIVE	\N	2024-01-14 12:03:49.591759	2024-01-14 12:03:49.591759
183	68.70	Navy-28 inch	23	9	ACTIVE	\N	2024-01-14 12:03:49.592289	2024-01-14 12:03:49.592289
184	68.70	Navy-29 inch	23	10	ACTIVE	\N	2024-01-14 12:03:49.592827	2024-01-14 12:03:49.592827
185	68.70	Navy-30 inch	23	11	ACTIVE	\N	2024-01-14 12:03:49.593346	2024-01-14 12:03:49.593346
186	68.70	Navy-31 inch	23	12	ACTIVE	\N	2024-01-14 12:03:49.593849	2024-01-14 12:03:49.593849
187	68.70	Navy-32 inch	23	13	ACTIVE	\N	2024-01-14 12:03:49.594356	2024-01-14 12:03:49.594356
188	68.70	Navy-33 inch	23	14	ACTIVE	\N	2024-01-14 12:03:49.594972	2024-01-14 12:03:49.594972
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, pricing, product_name, product_description, product_type, taxon_id, product_status, product_image_url, updated_at, created_at) FROM stdin;
1	0.00	Slim Fit Dotted Polo		CONFIGURABLE	3	ACTIVE	products/images/okRuOJyccu61W25/P_Slim Fit Dotted Polo-product.jpeg	2024-01-14 12:03:49.476998	2024-01-14 12:03:49.476998
2	0.00	Short Sleeve Polo		CONFIGURABLE	3	ACTIVE	products/images/Hqw3W7Lb1eoGnS2/P_Short Sleeve Polo-product.jpeg	2024-01-14 12:03:49.484243	2024-01-14 12:03:49.484243
3	0.00	Vito Willy Polo		CONFIGURABLE	3	ACTIVE	products/images/l4G8cgkOfEc67tH/P_Vito Willy Polo-product.jpeg	2024-01-14 12:03:49.492352	2024-01-14 12:03:49.492352
4	0.00	Regular Fit Crew-neck T-Shirt		CONFIGURABLE	4	ACTIVE	products/images/gOHGsKglMrb436F/P_Regular Fit Crew-neck T-Shirt-product.jpeg	2024-01-14 12:03:49.499374	2024-01-14 12:03:49.499374
5	0.00	Oversized Round-neck T-Shirt		CONFIGURABLE	4	ACTIVE	products/images/Zkv0ZSDXPijie30/P_Oversized Round-neck T-Shirt-product.jpeg	2024-01-14 12:03:49.504025	2024-01-14 12:03:49.504025
6	0.00	Relaxed Sleeveless T-Shirt		CONFIGURABLE	4	ACTIVE	products/images/LaDu93HyEMxW5Gw/P_Relaxed Sleeveless T-Shirt-product.jpeg	2024-01-14 12:03:49.507911	2024-01-14 12:03:49.507911
7	0.00	Chinos shorts		CONFIGURABLE	7	ACTIVE	products/images/NLGWQiDZZDMTMZL/P_Chinos shorts-product.jpeg	2024-01-14 12:03:49.512208	2024-01-14 12:03:49.512208
8	0.00	Relaxed Striped Shorts		CONFIGURABLE	7	ACTIVE	products/images/DoVaWMVECkYPjr9/P_Relaxed Striped Shorts-product.jpeg	2024-01-14 12:03:49.514849	2024-01-14 12:03:49.514849
9	0.00	Ultra Stretch Jeans		CONFIGURABLE	6	ACTIVE	products/images/z2FsGmzfwBxe1nF/P_Ultra Stretch Jeans-product.jpeg	2024-01-14 12:03:49.518151	2024-01-14 12:03:49.518151
10	0.00	Slim Fit Jeans		CONFIGURABLE	6	ACTIVE	products/images/qWzzstl225nbApJ/P_Slim Fit Jeans-product.jpeg	2024-01-14 12:03:49.524663	2024-01-14 12:03:49.524663
11	0.00	Jeans shorts		CONFIGURABLE	6	ACTIVE	products/images/mG2pJGstQEoQZHm/P_Jeans shorts-product.jpeg	2024-01-14 12:03:49.529539	2024-01-14 12:03:49.529539
12	0.00	Wide Fit Jeans		CONFIGURABLE	6	ACTIVE	products/images/8p5QJ3Yl0AvDP30/P_Wide Fit Jeans-product.jpeg	2024-01-14 12:03:49.536795	2024-01-14 12:03:49.536795
13	0.00	Floral Long Sleeve Blouse		CONFIGURABLE	13	ACTIVE	products/images/LqtcFl2Zl7rReln/P_Floral Long Sleeve Blouse-product.jpeg	2024-01-14 12:03:49.54215	2024-01-14 12:03:49.54215
14	0.00	Creped blouse with tie		CONFIGURABLE	13	ACTIVE	products/images/ZQTkiY9OCLRTUN3/P_Creped blouse with tie-product.jpeg	2024-01-14 12:03:49.546758	2024-01-14 12:03:49.546758
15	0.00	Pleated Long Sleeve Blouse		CONFIGURABLE	13	ACTIVE	products/images/8wJKerEIwWcfum3/P_Pleated Long Sleeve Blouse-product.jpeg	2024-01-14 12:03:49.551349	2024-01-14 12:03:49.551349
16	0.00	Striped Short-Sleeve T-Shirt		CONFIGURABLE	12	ACTIVE	products/images/qSgoNXMTVlVGurk/P_Striped Short-Sleeve T-Shirt-product.jpeg	2024-01-14 12:03:49.5545	2024-01-14 12:03:49.5545
17	0.00	USA Gray Mini T-Shirt		CONFIGURABLE	12	ACTIVE	products/images/XzeEjMCqZEOfgNM/P_USA Gray Mini T-Shirt-product.jpeg	2024-01-14 12:03:49.558772	2024-01-14 12:03:49.558772
18	0.00	NORMAL IS BORING (Short Sleeve Graphic T-Shirt)		CONFIGURABLE	12	ACTIVE	products/images/r5OyyEac3Qlja9f/P_NORMAL IS BORING (Short Sleeve Graphic T-Shirt)-product.jpeg	2024-01-14 12:03:49.561779	2024-01-14 12:03:49.561779
19	0.00	Long floral skirt		CONFIGURABLE	15	ACTIVE	products/images/6lk8gU16jPcr0FW/P_Long floral skirt-product.jpeg	2024-01-14 12:03:49.56624	2024-01-14 12:03:49.56624
20	0.00	Red checked skirt		CONFIGURABLE	15	ACTIVE	products/images/HE1YhSusFdR30Vg/P_Red checked skirt-product.jpeg	2024-01-14 12:03:49.570039	2024-01-14 12:03:49.570039
21	0.00	Short Sequin Skirt		CONFIGURABLE	15	ACTIVE	products/images/WlQdNwtoYSrz9Kx/P_Short Sequin Skirt-product.jpeg	2024-01-14 12:03:49.57391	2024-01-14 12:03:49.57391
22	0.00	Ultra Stretch Jeans (Damaged)		CONFIGURABLE	16	ACTIVE	products/images/86jlo8HaMYTxk1p/P_Ultra Stretch Jeans (Damaged)-product.jpeg	2024-01-14 12:03:49.576968	2024-01-14 12:03:49.576968
23	0.00	Wide Fit Jeans (High Waist)		CONFIGURABLE	16	ACTIVE	products/images/PPUOJGSCRz5mV45/P_Wide Fit Jeans-product.jpeg	2024-01-14 12:03:49.587519	2024-01-14 12:03:49.587519
\.


--
-- Data for Name: taxons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taxons (id, parent_id, taxon_name, slug, updated_at, created_at) FROM stdin;
1	\N	Men	men	2024-01-14 12:03:49.4389	2024-01-14 12:03:49.4389
2	1	Tops	tops	2024-01-14 12:03:49.440901	2024-01-14 12:03:49.440901
3	2	Polo Shirts	polo-shirts	2024-01-14 12:03:49.441889	2024-01-14 12:03:49.441889
4	2	T-Shirts	t-shirts	2024-01-14 12:03:49.442815	2024-01-14 12:03:49.442815
5	1	Bottoms	bottoms	2024-01-14 12:03:49.443393	2024-01-14 12:03:49.443393
6	5	Jeans	jeans	2024-01-14 12:03:49.443889	2024-01-14 12:03:49.443889
7	5	Shorts	shorts	2024-01-14 12:03:49.444615	2024-01-14 12:03:49.444615
8	1	Outerwear	jackets-coats	2024-01-14 12:03:49.445053	2024-01-14 12:03:49.445053
9	8	Jackets & Coats	jackets-coats	2024-01-14 12:03:49.44571	2024-01-14 12:03:49.44571
10	\N	Women	women	2024-01-14 12:03:49.446334	2024-01-14 12:03:49.446334
11	10	Tops	tops	2024-01-14 12:03:49.446867	2024-01-14 12:03:49.446867
12	11	T-Shirts	t-shirts	2024-01-14 12:03:49.447297	2024-01-14 12:03:49.447297
13	11	Blouses	blouses	2024-01-14 12:03:49.447728	2024-01-14 12:03:49.447728
14	10	Bottoms	bottoms	2024-01-14 12:03:49.448132	2024-01-14 12:03:49.448132
15	14	Skirts	skirts	2024-01-14 12:03:49.448632	2024-01-14 12:03:49.448632
16	14	Jeans	jeans	2024-01-14 12:03:49.449005	2024-01-14 12:03:49.449005
17	10	Outerwear	outerwear	2024-01-14 12:03:49.449594	2024-01-14 12:03:49.449594
18	17	Jackets & Coats	jackets-coats	2024-01-14 12:03:49.450027	2024-01-14 12:03:49.450027
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 44, true);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 6, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 108, true);


--
-- Name: product_association_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_association_types_id_seq', 1, false);


--
-- Name: product_configurable_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_configurable_options_id_seq', 46, true);


--
-- Name: product_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_option_values_id_seq', 34, true);


--
-- Name: product_taxons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_taxons_id_seq', 70, true);


--
-- Name: product_variant_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_options_id_seq', 376, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 188, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 23, true);


--
-- Name: taxons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxons_id_seq', 18, true);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: customer_cart_configurable_items customer_cart_configurable_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_configurable_items
    ADD CONSTRAINT customer_cart_configurable_items_pkey PRIMARY KEY (customer_id, product_variant_id);


--
-- Name: customer_cart_simple_items customer_cart_simple_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_simple_items
    ADD CONSTRAINT customer_cart_simple_items_pkey PRIMARY KEY (customer_id, product_id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_association_types product_association_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_association_types
    ADD CONSTRAINT product_association_types_pkey PRIMARY KEY (id);


--
-- Name: product_associations product_associations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_associations
    ADD CONSTRAINT product_associations_pkey PRIMARY KEY (product_association_type_id, product_id);


--
-- Name: product_configurable_options product_configurable_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_configurable_options
    ADD CONSTRAINT product_configurable_options_pkey PRIMARY KEY (id);


--
-- Name: product_configurable_options product_configurable_options_product_id_product_option_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_configurable_options
    ADD CONSTRAINT product_configurable_options_product_id_product_option_code_key UNIQUE (product_id, product_option_code);


--
-- Name: product_option_values product_option_values_option_code_option_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT product_option_values_option_code_option_value_key UNIQUE (option_code, option_value);


--
-- Name: product_option_values product_option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT product_option_values_pkey PRIMARY KEY (id);


--
-- Name: product_options product_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_pkey PRIMARY KEY (code);


--
-- Name: product_options product_options_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_position_key UNIQUE ("position");


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: product_taxons product_taxons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_taxons
    ADD CONSTRAINT product_taxons_pkey PRIMARY KEY (id);


--
-- Name: product_taxons product_taxons_product_id_taxon_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_taxons
    ADD CONSTRAINT product_taxons_product_id_taxon_id_key UNIQUE (product_id, taxon_id);


--
-- Name: product_variant_options product_variant_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_options
    ADD CONSTRAINT product_variant_options_pkey PRIMARY KEY (id);


--
-- Name: product_variant_options product_variant_options_product_variant_id_product_option_v_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_options
    ADD CONSTRAINT product_variant_options_product_variant_id_product_option_v_key UNIQUE (product_variant_id, product_option_value_id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_product_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_position_key UNIQUE (product_id, "position");


--
-- Name: product_variants product_variants_product_id_variant_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_variant_name_key UNIQUE (product_id, variant_name);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: taxons taxons_parent_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxons
    ADD CONSTRAINT taxons_parent_id_slug_key UNIQUE (parent_id, slug);


--
-- Name: taxons taxons_parent_id_taxon_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxons
    ADD CONSTRAINT taxons_parent_id_taxon_name_key UNIQUE (parent_id, taxon_name);


--
-- Name: taxons taxons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxons
    ADD CONSTRAINT taxons_pkey PRIMARY KEY (id);


--
-- Name: customer_cart_configurable_items customer_cart_configurable_items_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_configurable_items
    ADD CONSTRAINT customer_cart_configurable_items_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_cart_configurable_items customer_cart_configurable_items_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_configurable_items
    ADD CONSTRAINT customer_cart_configurable_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: customer_cart_simple_items customer_cart_simple_items_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_simple_items
    ADD CONSTRAINT customer_cart_simple_items_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_cart_simple_items customer_cart_simple_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_simple_items
    ADD CONSTRAINT customer_cart_simple_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_line_configurable_items order_line_configurable_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_configurable_items
    ADD CONSTRAINT order_line_configurable_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_line_configurable_items order_line_configurable_items_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_configurable_items
    ADD CONSTRAINT order_line_configurable_items_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: order_line_simple_items order_line_simple_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_simple_items
    ADD CONSTRAINT order_line_simple_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_line_simple_items order_line_simple_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_simple_items
    ADD CONSTRAINT order_line_simple_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: product_associations product_associations_product_association_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_associations
    ADD CONSTRAINT product_associations_product_association_type_id_fkey FOREIGN KEY (product_association_type_id) REFERENCES public.product_association_types(id);


--
-- Name: product_associations product_associations_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_associations
    ADD CONSTRAINT product_associations_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_configurable_options product_configurable_options_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_configurable_options
    ADD CONSTRAINT product_configurable_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_configurable_options product_configurable_options_product_option_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_configurable_options
    ADD CONSTRAINT product_configurable_options_product_option_code_fkey FOREIGN KEY (product_option_code) REFERENCES public.product_options(code);


--
-- Name: product_option_values product_option_values_option_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT product_option_values_option_code_fkey FOREIGN KEY (option_code) REFERENCES public.product_options(code);


--
-- Name: product_reviews product_reviews_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_taxons product_taxons_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_taxons
    ADD CONSTRAINT product_taxons_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_taxons product_taxons_taxon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_taxons
    ADD CONSTRAINT product_taxons_taxon_id_fkey FOREIGN KEY (taxon_id) REFERENCES public.taxons(id);


--
-- Name: product_variant_options product_variant_options_product_option_value_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_options
    ADD CONSTRAINT product_variant_options_product_option_value_id_fkey FOREIGN KEY (product_option_value_id) REFERENCES public.product_option_values(id);


--
-- Name: product_variant_options product_variant_options_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_options
    ADD CONSTRAINT product_variant_options_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_taxon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_taxon_id_fkey FOREIGN KEY (taxon_id) REFERENCES public.taxons(id);


--
-- Name: taxons taxons_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxons
    ADD CONSTRAINT taxons_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.taxons(id);


--
-- PostgreSQL database dump complete
--

