--
-- PostgreSQL database dump
--

\restrict hfvITBV1HP65DKpAKbphZFyttrts3g6J3whns3tksm89z4AsS33TPsNZEu7Qice

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-31 13:10:16

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
-- TOC entry 244 (class 1259 OID 16658)
-- Name: alertas_emergencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alertas_emergencia (
    id integer NOT NULL,
    condominio_id integer,
    usuario_id integer,
    tipo_alerta character varying(50),
    latitud numeric(10,8),
    longitud numeric(11,8),
    descripcion_ubicacion text,
    estado character varying(20) DEFAULT 'activa'::character varying,
    atendido_por integer,
    fecha_atencion timestamp without time zone,
    fecha_resolucion timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alertas_emergencia OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16657)
-- Name: alertas_emergencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alertas_emergencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alertas_emergencia_id_seq OWNER TO postgres;

--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 243
-- Name: alertas_emergencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alertas_emergencia_id_seq OWNED BY public.alertas_emergencia.id;


--
-- TOC entry 248 (class 1259 OID 16707)
-- Name: asistencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asistencias (
    id integer NOT NULL,
    personal_id integer,
    hora_entrada timestamp without time zone,
    hora_salida timestamp without time zone,
    ubicacion_lat numeric(10,8),
    ubicacion_lng numeric(11,8),
    estado character varying(20) DEFAULT 'presente'::character varying,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asistencias OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16706)
-- Name: asistencias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asistencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencias_id_seq OWNER TO postgres;

--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 247
-- Name: asistencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asistencias_id_seq OWNED BY public.asistencias.id;


--
-- TOC entry 254 (class 1259 OID 16761)
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(100) NOT NULL,
    tabla_afectada character varying(100),
    registro_id integer,
    valor_anterior jsonb,
    valor_nuevo jsonb,
    ip_address character varying(50),
    user_agent text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16760)
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_id_seq OWNER TO postgres;

--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 253
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_id_seq OWNED BY public.auditoria.id;


--
-- TOC entry 242 (class 1259 OID 16639)
-- Name: canales_ptt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canales_ptt (
    id integer NOT NULL,
    condominio_id integer,
    nombre character varying(100) NOT NULL,
    descripcion text,
    tipo_canal character varying(30) DEFAULT 'general'::character varying,
    es_privado boolean DEFAULT false,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.canales_ptt OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16638)
-- Name: canales_ptt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.canales_ptt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.canales_ptt_id_seq OWNER TO postgres;

--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 241
-- Name: canales_ptt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.canales_ptt_id_seq OWNED BY public.canales_ptt.id;


--
-- TOC entry 240 (class 1259 OID 16617)
-- Name: comunicaciones_ptt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comunicaciones_ptt (
    id integer NOT NULL,
    condominio_id integer,
    canal_id character varying(50),
    usuario_id integer,
    tipo_mensaje character varying(20),
    duracion_segundos integer,
    url_audio text,
    transcripcion text,
    prioridad character varying(20) DEFAULT 'normal'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comunicaciones_ptt OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16616)
-- Name: comunicaciones_ptt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comunicaciones_ptt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comunicaciones_ptt_id_seq OWNER TO postgres;

--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 239
-- Name: comunicaciones_ptt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comunicaciones_ptt_id_seq OWNED BY public.comunicaciones_ptt.id;


--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: condominios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condominios (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    direccion text,
    ciudad character varying(100),
    pais character varying(100) DEFAULT 'Perú'::character varying,
    telefono character varying(20),
    email character varying(255),
    estado character varying(20) DEFAULT 'activo'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.condominios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16407)
-- Name: condominios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.condominios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.condominios_id_seq OWNER TO postgres;

--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 221
-- Name: condominios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.condominios_id_seq OWNED BY public.condominios.id;


--
-- TOC entry 236 (class 1259 OID 16566)
-- Name: incidentes_seguridad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidentes_seguridad (
    id integer NOT NULL,
    condominio_id integer,
    reportado_por integer,
    tipo_incidente character varying(50),
    severidad character varying(20) DEFAULT 'media'::character varying,
    ubicacion character varying(255),
    descripcion text NOT NULL,
    estado character varying(20) DEFAULT 'investigando'::character varying,
    urls_evidencia text[],
    asignado_a integer,
    fecha_resolucion timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.incidentes_seguridad OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16565)
-- Name: incidentes_seguridad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incidentes_seguridad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidentes_seguridad_id_seq OWNER TO postgres;

--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 235
-- Name: incidentes_seguridad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incidentes_seguridad_id_seq OWNED BY public.incidentes_seguridad.id;


--
-- TOC entry 230 (class 1259 OID 16478)
-- Name: invitados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitados (
    id integer NOT NULL,
    residente_id integer,
    nombres character varying(255) NOT NULL,
    tipo_documento character varying(20) DEFAULT 'DNI'::character varying,
    numero_documento character varying(20) NOT NULL,
    telefono character varying(20),
    codigo_acceso character varying(10),
    valido_desde timestamp without time zone,
    valido_hasta timestamp without time zone,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invitados OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16477)
-- Name: invitados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitados_id_seq OWNER TO postgres;

--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 229
-- Name: invitados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitados_id_seq OWNED BY public.invitados.id;


--
-- TOC entry 250 (class 1259 OID 16724)
-- Name: mantenimiento_predictivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mantenimiento_predictivo (
    id integer NOT NULL,
    condominio_id integer,
    nombre_equipo character varying(255),
    tipo_equipo character varying(100),
    fecha_ultimo_mantenimiento date,
    fecha_proximo_mantenimiento date,
    probabilidad_falla numeric(5,2),
    estado character varying(20) DEFAULT 'ok'::character varying,
    datos_sensor jsonb,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mantenimiento_predictivo OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16723)
-- Name: mantenimiento_predictivo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mantenimiento_predictivo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mantenimiento_predictivo_id_seq OWNER TO postgres;

--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 249
-- Name: mantenimiento_predictivo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mantenimiento_predictivo_id_seq OWNED BY public.mantenimiento_predictivo.id;


--
-- TOC entry 252 (class 1259 OID 16741)
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    usuario_id integer,
    titulo character varying(255) NOT NULL,
    mensaje text NOT NULL,
    tipo character varying(50),
    leido boolean DEFAULT false,
    prioridad character varying(20) DEFAULT 'normal'::character varying,
    url_accion text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16740)
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 251
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- TOC entry 238 (class 1259 OID 16595)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    residente_id integer,
    condominio_id integer,
    monto numeric(12,2) NOT NULL,
    moneda character varying(3) DEFAULT 'PEN'::character varying,
    concepto character varying(255),
    metodo_pago character varying(50),
    id_transaccion character varying(100),
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    fecha_vencimiento date,
    fecha_pago timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16594)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 237
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- TOC entry 246 (class 1259 OID 16685)
-- Name: personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal (
    id integer NOT NULL,
    usuario_id integer,
    condominio_id integer,
    cargo character varying(100),
    turno character varying(50),
    fecha_contratacion date,
    certificaciones text[],
    estado character varying(20) DEFAULT 'activo'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.personal OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16684)
-- Name: personal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_id_seq OWNER TO postgres;

--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 245
-- Name: personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_id_seq OWNED BY public.personal.id;


--
-- TOC entry 232 (class 1259 OID 16496)
-- Name: registros_acceso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros_acceso (
    id integer NOT NULL,
    condominio_id integer,
    usuario_id integer,
    invitado_id integer,
    vehiculo_id integer,
    tipo_acceso character varying(30),
    hora_ingreso timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hora_salida timestamp without time zone,
    puerta character varying(50),
    foto_url text,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registros_acceso OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16495)
-- Name: registros_acceso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_acceso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_acceso_id_seq OWNER TO postgres;

--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 231
-- Name: registros_acceso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_acceso_id_seq OWNED BY public.registros_acceso.id;


--
-- TOC entry 226 (class 1259 OID 16440)
-- Name: residentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.residentes (
    id integer NOT NULL,
    usuario_id integer,
    unidad_id integer,
    tipo_vinculo character varying(50) DEFAULT 'propietario'::character varying,
    fecha_ingreso date,
    fecha_salida date,
    estado character varying(20) DEFAULT 'activo'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.residentes OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16439)
-- Name: residentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.residentes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.residentes_id_seq OWNER TO postgres;

--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 225
-- Name: residentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.residentes_id_seq OWNED BY public.residentes.id;


--
-- TOC entry 234 (class 1259 OID 16528)
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    condominio_id integer,
    residente_id integer,
    titulo character varying(255) NOT NULL,
    descripcion text NOT NULL,
    categoria character varying(50),
    subcategoria character varying(50),
    prioridad character varying(20) DEFAULT 'media'::character varying,
    estado character varying(20) DEFAULT 'abierto'::character varying,
    asignado_a integer,
    fecha_resolucion timestamp without time zone,
    resuelto_por integer,
    calificacion integer,
    clasificado_ia boolean DEFAULT false,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tickets_calificacion_check CHECK (((calificacion >= 1) AND (calificacion <= 5)))
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16527)
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tickets_id_seq OWNER TO postgres;

--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 233
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- TOC entry 224 (class 1259 OID 16422)
-- Name: unidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidades (
    id integer NOT NULL,
    condominio_id integer,
    numero_unidad character varying(20) NOT NULL,
    torre character varying(50),
    piso integer,
    area_m2 numeric(10,2),
    estado character varying(20) DEFAULT 'ocupada'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.unidades OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16421)
-- Name: unidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unidades_id_seq OWNER TO postgres;

--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 223
-- Name: unidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unidades_id_seq OWNED BY public.unidades.id;


--
-- TOC entry 220 (class 1259 OID 16388)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombres character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    telefono character varying(20),
    rol character varying(50) DEFAULT 'residente'::character varying,
    estado character varying(20) DEFAULT 'activo'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    condominio_id integer
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16387)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 228 (class 1259 OID 16461)
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id integer NOT NULL,
    residente_id integer,
    placa character varying(20) NOT NULL,
    marca character varying(50),
    modelo character varying(50),
    color character varying(30),
    tipo character varying(30) DEFAULT 'auto'::character varying,
    estado character varying(20) DEFAULT 'activo'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16460)
-- Name: vehiculos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculos_id_seq OWNER TO postgres;

--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 227
-- Name: vehiculos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculos_id_seq OWNED BY public.vehiculos.id;


--
-- TOC entry 4996 (class 2604 OID 16661)
-- Name: alertas_emergencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_emergencia ALTER COLUMN id SET DEFAULT nextval('public.alertas_emergencia_id_seq'::regclass);


--
-- TOC entry 5002 (class 2604 OID 16710)
-- Name: asistencias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencias ALTER COLUMN id SET DEFAULT nextval('public.asistencias_id_seq'::regclass);


--
-- TOC entry 5012 (class 2604 OID 16764)
-- Name: auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria ALTER COLUMN id SET DEFAULT nextval('public.auditoria_id_seq'::regclass);


--
-- TOC entry 4992 (class 2604 OID 16642)
-- Name: canales_ptt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canales_ptt ALTER COLUMN id SET DEFAULT nextval('public.canales_ptt_id_seq'::regclass);


--
-- TOC entry 4989 (class 2604 OID 16620)
-- Name: comunicaciones_ptt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicaciones_ptt ALTER COLUMN id SET DEFAULT nextval('public.comunicaciones_ptt_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 16411)
-- Name: condominios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominios ALTER COLUMN id SET DEFAULT nextval('public.condominios_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 16569)
-- Name: incidentes_seguridad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes_seguridad ALTER COLUMN id SET DEFAULT nextval('public.incidentes_seguridad_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16481)
-- Name: invitados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitados ALTER COLUMN id SET DEFAULT nextval('public.invitados_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 16727)
-- Name: mantenimiento_predictivo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_predictivo ALTER COLUMN id SET DEFAULT nextval('public.mantenimiento_predictivo_id_seq'::regclass);


--
-- TOC entry 5008 (class 2604 OID 16744)
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 16598)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4999 (class 2604 OID 16688)
-- Name: personal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal ALTER COLUMN id SET DEFAULT nextval('public.personal_id_seq'::regclass);


--
-- TOC entry 4970 (class 2604 OID 16499)
-- Name: registros_acceso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso ALTER COLUMN id SET DEFAULT nextval('public.registros_acceso_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 16443)
-- Name: residentes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residentes ALTER COLUMN id SET DEFAULT nextval('public.residentes_id_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 16531)
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16425)
-- Name: unidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidades ALTER COLUMN id SET DEFAULT nextval('public.unidades_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 16391)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 16464)
-- Name: vehiculos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos ALTER COLUMN id SET DEFAULT nextval('public.vehiculos_id_seq'::regclass);


--
-- TOC entry 5267 (class 0 OID 16658)
-- Dependencies: 244
-- Data for Name: alertas_emergencia; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5271 (class 0 OID 16707)
-- Dependencies: 248
-- Data for Name: asistencias; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5277 (class 0 OID 16761)
-- Dependencies: 254
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5265 (class 0 OID 16639)
-- Dependencies: 242
-- Data for Name: canales_ptt; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5263 (class 0 OID 16617)
-- Dependencies: 240
-- Data for Name: comunicaciones_ptt; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5245 (class 0 OID 16408)
-- Dependencies: 222
-- Data for Name: condominios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.condominios VALUES (1, 'Condominio Las Palmas', 'Av. Principal 123', 'Lima', 'Perú', '+51 999 999 999', 'contacto@laspalmas.com', 'activo', '2026-03-25 12:19:41.163089', '2026-03-25 16:03:48.767393');
INSERT INTO public.condominios VALUES (2, 'Residencial Los Olivos Actualizado', 'Calle Ficticia 456', 'Lima', 'Perú', '+51 999 222 333', 'contacto@losolivos.com', 'activo', '2026-03-25 15:53:10.458438', '2026-03-25 16:11:29.630022');


--
-- TOC entry 5259 (class 0 OID 16566)
-- Dependencies: 236
-- Data for Name: incidentes_seguridad; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5253 (class 0 OID 16478)
-- Dependencies: 230
-- Data for Name: invitados; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5273 (class 0 OID 16724)
-- Dependencies: 250
-- Data for Name: mantenimiento_predictivo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5275 (class 0 OID 16741)
-- Dependencies: 252
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5261 (class 0 OID 16595)
-- Dependencies: 238
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5269 (class 0 OID 16685)
-- Dependencies: 246
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5255 (class 0 OID 16496)
-- Dependencies: 232
-- Data for Name: registros_acceso; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5249 (class 0 OID 16440)
-- Dependencies: 226
-- Data for Name: residentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.residentes VALUES (1, 2, 1, 'propietario', '2026-03-25', NULL, 'activo', '2026-03-25 14:15:53.063332', '2026-03-25 16:04:22.22027');
INSERT INTO public.residentes VALUES (2, 3, 1, 'familiar', '2026-03-25', NULL, 'activo', '2026-03-25 14:15:53.063332', '2026-03-25 16:04:22.22027');
INSERT INTO public.residentes VALUES (3, 5, 1, 'propietario', '2026-03-26', NULL, 'activo', '2026-03-26 15:03:35.576842', '2026-03-26 15:03:35.576842');
INSERT INTO public.residentes VALUES (4, 8, 1, 'propietario', '2026-03-31', NULL, 'activo', '2026-03-31 11:48:00.019831', '2026-03-31 11:48:00.019831');


--
-- TOC entry 5257 (class 0 OID 16528)
-- Dependencies: 234
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tickets VALUES (1, 1, 4, 'Grifo goteando en cocina', 'El grifo de la cocina está goteando constantemente desde ayer', 'mantenimiento', 'gasfitería', 'media', 'abierto', NULL, NULL, NULL, NULL, false, '2026-03-31 11:50:07.891229', '2026-03-31 11:50:07.891229');
INSERT INTO public.tickets VALUES (2, 1, 2, 'Luz apagada en pasillo', 'La luz del pasillo del tercer piso no funciona', 'mantenimiento', 'electricidad', 'media', 'en_progreso', 4, NULL, NULL, NULL, false, '2026-03-31 12:10:04.402091', '2026-03-31 12:15:41.952388');


--
-- TOC entry 5247 (class 0 OID 16422)
-- Dependencies: 224
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.unidades VALUES (1, 1, 'A-101', 'Torre A', 1, 85.50, 'ocupada', '2026-03-25 12:19:41.163089', '2026-03-25 16:04:06.936074');


--
-- TOC entry 5243 (class 0 OID 16388)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (4, 'carlos.vigilante@ejemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos Alberto', 'Ramírez Silva', '+51 777 666 555', 'vigilante', 'activo', '2026-03-25 14:15:53.063332', '2026-03-25 14:15:53.063332', NULL);
INSERT INTO public.usuarios VALUES (5, 'ana.martinez@ejemplo.com', '$2b$10$1YkpIIUSax6W3Xl1IGbcnuUXAxKHEl9Ovtyq60/q42QTZqN2tPys2', 'Ana María', 'Martínez López', '+51 911 888 777', 'residente', 'activo', '2026-03-25 14:21:46.201882', '2026-03-25 14:21:46.201882', NULL);
INSERT INTO public.usuarios VALUES (1, 'admin@srmp.com', '$2b$10$oLg2AptiR3NlBPYcLsdhbueGxJZwoEUc07p50P2OKoXZpXsMgYR0m', 'Administrador', 'Principal', NULL, 'admin', 'activo', '2026-03-25 12:19:41.163089', '2026-03-25 12:19:41.163089', NULL);
INSERT INTO public.usuarios VALUES (3, 'maria.garcia@ejemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'María Elena', 'García López', '+51 888 777 666', 'residente', 'activo', '2026-03-25 14:15:53.063332', '2026-03-25 14:15:53.063332', 1);
INSERT INTO public.usuarios VALUES (7, 'admin.losolivos@srmp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'Los Olivos', '+51 999 200 200', 'admin', 'activo', '2026-03-26 11:08:48.215728', '2026-03-26 11:08:48.215728', 2);
INSERT INTO public.usuarios VALUES (6, 'admin.laspalmas@srmp.com', '$2b$10$z2O3dyC/H3rLYNT1YU7ElOlnuLt5DqOMr1dif6oyuKFWwvOdnh53G', 'Admin', 'Las Palmas', '+51 999 100 100', 'admin', 'activo', '2026-03-26 11:06:29.974503', '2026-03-26 11:06:29.974503', 1);
INSERT INTO public.usuarios VALUES (2, 'juan.perez@ejemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Juan Carlos', 'Pérez Gómez', '+51 999 888 777', 'residente', 'activo', '2026-03-25 14:15:53.063332', '2026-03-25 14:15:53.063332', 1);
INSERT INTO public.usuarios VALUES (8, 'test.residente@srmp.com', '$2b$10$HHlJFi//oRE3xC9T2VQUneSnwzQ3CjkFrlF5isu8lSn8ThtenI/NC', 'Test', 'Residente', '+51 999 777 888', 'residente', 'activo', '2026-03-31 11:44:48.376209', '2026-03-31 11:44:48.376209', 1);


--
-- TOC entry 5251 (class 0 OID 16461)
-- Dependencies: 228
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5301 (class 0 OID 0)
-- Dependencies: 243
-- Name: alertas_emergencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alertas_emergencia_id_seq', 1, false);


--
-- TOC entry 5302 (class 0 OID 0)
-- Dependencies: 247
-- Name: asistencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asistencias_id_seq', 1, false);


--
-- TOC entry 5303 (class 0 OID 0)
-- Dependencies: 253
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_id_seq', 1, false);


--
-- TOC entry 5304 (class 0 OID 0)
-- Dependencies: 241
-- Name: canales_ptt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.canales_ptt_id_seq', 1, false);


--
-- TOC entry 5305 (class 0 OID 0)
-- Dependencies: 239
-- Name: comunicaciones_ptt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comunicaciones_ptt_id_seq', 1, false);


--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 221
-- Name: condominios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.condominios_id_seq', 2, true);


--
-- TOC entry 5307 (class 0 OID 0)
-- Dependencies: 235
-- Name: incidentes_seguridad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incidentes_seguridad_id_seq', 1, false);


--
-- TOC entry 5308 (class 0 OID 0)
-- Dependencies: 229
-- Name: invitados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitados_id_seq', 1, false);


--
-- TOC entry 5309 (class 0 OID 0)
-- Dependencies: 249
-- Name: mantenimiento_predictivo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mantenimiento_predictivo_id_seq', 1, false);


--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 251
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 1, false);


--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 237
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 245
-- Name: personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_id_seq', 1, false);


--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 231
-- Name: registros_acceso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_acceso_id_seq', 1, false);


--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 225
-- Name: residentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.residentes_id_seq', 4, true);


--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 233
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 2, true);


--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 223
-- Name: unidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unidades_id_seq', 1, true);


--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 8, true);


--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 227
-- Name: vehiculos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehiculos_id_seq', 1, false);


--
-- TOC entry 5051 (class 2606 OID 16668)
-- Name: alertas_emergencia alertas_emergencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_emergencia
    ADD CONSTRAINT alertas_emergencia_pkey PRIMARY KEY (id);


--
-- TOC entry 5055 (class 2606 OID 16717)
-- Name: asistencias asistencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_pkey PRIMARY KEY (id);


--
-- TOC entry 5062 (class 2606 OID 16771)
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 16651)
-- Name: canales_ptt canales_ptt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canales_ptt
    ADD CONSTRAINT canales_ptt_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 16627)
-- Name: comunicaciones_ptt comunicaciones_ptt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicaciones_ptt
    ADD CONSTRAINT comunicaciones_ptt_pkey PRIMARY KEY (id);


--
-- TOC entry 5021 (class 2606 OID 16420)
-- Name: condominios condominios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condominios
    ADD CONSTRAINT condominios_pkey PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 16578)
-- Name: incidentes_seguridad incidentes_seguridad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes_seguridad
    ADD CONSTRAINT incidentes_seguridad_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 16489)
-- Name: invitados invitados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitados
    ADD CONSTRAINT invitados_pkey PRIMARY KEY (id);


--
-- TOC entry 5057 (class 2606 OID 16734)
-- Name: mantenimiento_predictivo mantenimiento_predictivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_predictivo
    ADD CONSTRAINT mantenimiento_predictivo_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 16754)
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 16605)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 5053 (class 2606 OID 16695)
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 16506)
-- Name: registros_acceso registros_acceso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso
    ADD CONSTRAINT registros_acceso_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 16449)
-- Name: residentes residentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residentes
    ADD CONSTRAINT residentes_pkey PRIMARY KEY (id);


--
-- TOC entry 5039 (class 2606 OID 16544)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 5023 (class 2606 OID 16433)
-- Name: unidades unidades_condominio_id_numero_unidad_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_condominio_id_numero_unidad_key UNIQUE (condominio_id, numero_unidad);


--
-- TOC entry 5025 (class 2606 OID 16431)
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 16406)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 5019 (class 2606 OID 16404)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 16471)
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id);


--
-- TOC entry 5063 (class 1259 OID 16785)
-- Name: idx_auditoria_fecha_creacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_fecha_creacion ON public.auditoria USING btree (fecha_creacion);


--
-- TOC entry 5040 (class 1259 OID 16783)
-- Name: idx_incidentes_seguridad_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_incidentes_seguridad_estado ON public.incidentes_seguridad USING btree (estado);


--
-- TOC entry 5058 (class 1259 OID 16784)
-- Name: idx_notificaciones_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notificaciones_usuario_id ON public.notificaciones USING btree (usuario_id);


--
-- TOC entry 5043 (class 1259 OID 16781)
-- Name: idx_pagos_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pagos_estado ON public.pagos USING btree (estado);


--
-- TOC entry 5033 (class 1259 OID 16782)
-- Name: idx_registros_acceso_hora_ingreso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registros_acceso_hora_ingreso ON public.registros_acceso USING btree (hora_ingreso);


--
-- TOC entry 5026 (class 1259 OID 16778)
-- Name: idx_residentes_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_residentes_usuario_id ON public.residentes USING btree (usuario_id);


--
-- TOC entry 5036 (class 1259 OID 16779)
-- Name: idx_tickets_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_estado ON public.tickets USING btree (estado);


--
-- TOC entry 5037 (class 1259 OID 16780)
-- Name: idx_tickets_fecha_creacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_fecha_creacion ON public.tickets USING btree (fecha_creacion);


--
-- TOC entry 5015 (class 1259 OID 16777)
-- Name: idx_usuarios_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email);


--
-- TOC entry 5086 (class 2606 OID 16679)
-- Name: alertas_emergencia alertas_emergencia_atendido_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_emergencia
    ADD CONSTRAINT alertas_emergencia_atendido_por_fkey FOREIGN KEY (atendido_por) REFERENCES public.usuarios(id);


--
-- TOC entry 5087 (class 2606 OID 16669)
-- Name: alertas_emergencia alertas_emergencia_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_emergencia
    ADD CONSTRAINT alertas_emergencia_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5088 (class 2606 OID 16674)
-- Name: alertas_emergencia alertas_emergencia_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_emergencia
    ADD CONSTRAINT alertas_emergencia_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5091 (class 2606 OID 16718)
-- Name: asistencias asistencias_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id);


--
-- TOC entry 5094 (class 2606 OID 16772)
-- Name: auditoria auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5085 (class 2606 OID 16652)
-- Name: canales_ptt canales_ptt_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canales_ptt
    ADD CONSTRAINT canales_ptt_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5083 (class 2606 OID 16628)
-- Name: comunicaciones_ptt comunicaciones_ptt_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicaciones_ptt
    ADD CONSTRAINT comunicaciones_ptt_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5084 (class 2606 OID 16633)
-- Name: comunicaciones_ptt comunicaciones_ptt_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicaciones_ptt
    ADD CONSTRAINT comunicaciones_ptt_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5078 (class 2606 OID 16589)
-- Name: incidentes_seguridad incidentes_seguridad_asignado_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes_seguridad
    ADD CONSTRAINT incidentes_seguridad_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES public.usuarios(id);


--
-- TOC entry 5079 (class 2606 OID 16579)
-- Name: incidentes_seguridad incidentes_seguridad_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes_seguridad
    ADD CONSTRAINT incidentes_seguridad_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5080 (class 2606 OID 16584)
-- Name: incidentes_seguridad incidentes_seguridad_reportado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes_seguridad
    ADD CONSTRAINT incidentes_seguridad_reportado_por_fkey FOREIGN KEY (reportado_por) REFERENCES public.usuarios(id);


--
-- TOC entry 5069 (class 2606 OID 16490)
-- Name: invitados invitados_residente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitados
    ADD CONSTRAINT invitados_residente_id_fkey FOREIGN KEY (residente_id) REFERENCES public.residentes(id);


--
-- TOC entry 5092 (class 2606 OID 16735)
-- Name: mantenimiento_predictivo mantenimiento_predictivo_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mantenimiento_predictivo
    ADD CONSTRAINT mantenimiento_predictivo_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5093 (class 2606 OID 16755)
-- Name: notificaciones notificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5081 (class 2606 OID 16611)
-- Name: pagos pagos_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5082 (class 2606 OID 16606)
-- Name: pagos pagos_residente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_residente_id_fkey FOREIGN KEY (residente_id) REFERENCES public.residentes(id);


--
-- TOC entry 5089 (class 2606 OID 16701)
-- Name: personal personal_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5090 (class 2606 OID 16696)
-- Name: personal personal_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5070 (class 2606 OID 16507)
-- Name: registros_acceso registros_acceso_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso
    ADD CONSTRAINT registros_acceso_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5071 (class 2606 OID 16517)
-- Name: registros_acceso registros_acceso_invitado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso
    ADD CONSTRAINT registros_acceso_invitado_id_fkey FOREIGN KEY (invitado_id) REFERENCES public.invitados(id);


--
-- TOC entry 5072 (class 2606 OID 16512)
-- Name: registros_acceso registros_acceso_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso
    ADD CONSTRAINT registros_acceso_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5073 (class 2606 OID 16522)
-- Name: registros_acceso registros_acceso_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_acceso
    ADD CONSTRAINT registros_acceso_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id);


--
-- TOC entry 5066 (class 2606 OID 16455)
-- Name: residentes residentes_unidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residentes
    ADD CONSTRAINT residentes_unidad_id_fkey FOREIGN KEY (unidad_id) REFERENCES public.unidades(id);


--
-- TOC entry 5067 (class 2606 OID 16450)
-- Name: residentes residentes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.residentes
    ADD CONSTRAINT residentes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5074 (class 2606 OID 16555)
-- Name: tickets tickets_asignado_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES public.usuarios(id);


--
-- TOC entry 5075 (class 2606 OID 16545)
-- Name: tickets tickets_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5076 (class 2606 OID 16550)
-- Name: tickets tickets_residente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_residente_id_fkey FOREIGN KEY (residente_id) REFERENCES public.residentes(id);


--
-- TOC entry 5077 (class 2606 OID 16560)
-- Name: tickets tickets_resuelto_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_resuelto_por_fkey FOREIGN KEY (resuelto_por) REFERENCES public.usuarios(id);


--
-- TOC entry 5065 (class 2606 OID 16434)
-- Name: unidades unidades_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5064 (class 2606 OID 16794)
-- Name: usuarios usuarios_condominio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_condominio_id_fkey FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);


--
-- TOC entry 5068 (class 2606 OID 16472)
-- Name: vehiculos vehiculos_residente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_residente_id_fkey FOREIGN KEY (residente_id) REFERENCES public.residentes(id);


-- Completed on 2026-03-31 13:10:16

--
-- PostgreSQL database dump complete
--

\unrestrict hfvITBV1HP65DKpAKbphZFyttrts3g6J3whns3tksm89z4AsS33TPsNZEu7Qice

