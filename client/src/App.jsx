import { useState, useEffect } from "react";
import logo from "./assets/logo.png";

// Logos de divisiones — se cargan dinámicamente con fallback al icono genérico
const divisionLogos = import.meta.glob("./assets/divisions/*", { eager: true });

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoDashboard = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const IcoUsers = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IcoShield = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IcoDivision = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IcoStar = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IcoSearch = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IcoChevronLeft = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IcoChevronRight = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IcoClock = () => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoCalendar = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  label: "Dashboard",  Icon: IcoCalendar  },
  { id: "policias",   label: "Policías",   Icon: IcoUsers     },
  { id: "divisiones", label: "Divisiones", Icon: IcoDivision  },
  { id: "rangos",     label: "Rangos",     Icon: IcoStar      },
];

function Sidebar({ active, setActive, currentUser }) {
  const initials = currentUser?.username
    ? currentUser.username.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="SAPD" className="sidebar-logo-img" />
        <div>
          <div className="sidebar-logo-title">SAPD</div>
          <div className="sidebar-logo-sub">San Andreas PD</div>
        </div>
      </div>

      <div className="sidebar-section-label">Navegación</div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`sidebar-nav-item${active === id ? " active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon />
            <span>{label}</span>
            {active === id && <div className="sidebar-nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* Footer usuario */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar sm">{initials}</div>
          <div>
            <div className="sidebar-user-name">{currentUser?.username || "—"}</div>
            <div className="sidebar-user-rank">{currentUser?.jurisdiction || "Oficial"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
const LABELS = { dashboard: "Dashboard", policias: "Policías", divisiones: "Divisiones", rangos: "Rangos" };

function Header({ active, currentUser }) {
  const initials = currentUser?.username
    ? currentUser.username.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <span className="breadcrumb-root">Inicio</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{LABELS[active]}</span>
      </div>

      <div className="header-actions">
        <span className="header-badge lspd">LSPD</span>
        <span className="header-badge bcso">BCSO</span>
        <div className="header-user">
          <div className="avatar">{initials}</div>
          <span className="header-user-name">{currentUser?.username || "Usuario"}</span>
          <span className="header-chevron">▾</span>
        </div>
      </div>
    </header>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, color, Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon ${color}`}><Icon /></div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-sub">{sub}</div>
    </div>
  );
}

// ─── Officer Card ─────────────────────────────────────────────────────────────
function OfficerCard({ user }) {
  const initials = user.username
    ? user.username.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const jur = (user.jurisdiction || "").toLowerCase();
  const isActive = user.active !== false;

  return (
    <div className="officer-card">
      <div className="officer-card-top">
        <div className={`avatar lg`}>{initials}</div>
        <div className={`status-dot ${isActive ? "active" : "inactive"}`} />
      </div>
      <div className="officer-card-name">{user.username}</div>
      <div className="officer-card-rank">
        {typeof user.rank === "object" ? user.rank?.name : user.rank || "Sin rango"}
      </div>
      <div className="officer-card-badges">
        <span className={`jur-badge ${jur}`}>{user.jurisdiction || "—"}</span>
        {(user.divisions || []).slice(0, 2).map((d, i) => (
          <span key={i} className="div-badge">{typeof d === "object" ? d.name : d}</span>
        ))}
      </div>
      <div className="officer-card-footer">
        <span className={`status-label ${isActive ? "active" : "inactive"}`}>
          {isActive ? "Activo" : "Inactivo"}
        </span>
        <button className="btn-primary">Ver más</button>
      </div>
    </div>
  );
}

// ─── Utilidades de fecha ──────────────────────────────────────────────────────
const DIAS   = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES  = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Devuelve el lunes de la semana a la que pertenece 'date'
function getLunes(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Dom,1=Lun...
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Devuelve los 7 días de la semana comenzando en lunes
function getSemana(lunes) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d;
  });
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// ─── Tipos de evento y su estilo visual ──────────────────────────────────────
//
//  licencia      → Toma de licencias ASD/PPD      → visible para TODOS
//  reunion_jur   → Reunión de jurisdicción         → solo su jurisdicción (LSPD o BCSO)
//  reunion_sapd  → Reunión general SAPD            → visible para TODOS
//  evento_div    → Evento de división              → solo miembros de esa división
//
const TIPO_STYLES = {
  licencia:     { color: "#a78bfa", bg: "rgba(139,92,246,0.13)",  label: "Licencias"      },
  reunion_jur:  { color: "var(--blue)",   bg: "var(--blue-bg)",   label: "Reunión juris." },
  reunion_sapd: { color: "var(--green)",  bg: "var(--green-bg)",  label: "Reunión SAPD"   },
  evento_div:   { color: "var(--yellow)", bg: "var(--yellow-bg)", label: "División"       },
};

// ─── Estructura de un evento ──────────────────────────────────────────────────
// {
//   id, titulo, hora, tipo, diasOffset,
//   subtipo?:     "ASD" | "PPD"                          (para licencias)
//   jurisdiccion?: "LSPD" | "BCSO"                       (para reunion_jur)
//   division?:    nombre de la división                  (para evento_div)
// }
//
// Reglas de visibilidad:
//   licencia      → todos
//   reunion_sapd  → todos
//   reunion_jur   → solo agentes cuya jurisdiccion === evento.jurisdiccion
//   evento_div    → solo agentes que tengan esa división en su array divisions

// Licencias posibles: ASD | PPD | SAHP
const EVENTOS_EJEMPLO = [];

// Filtra los eventos según el perfil del usuario actual
function filtrarEventos(eventos, user) {
  const userJur  = user?.jurisdiction || "";
  const userDivs = (user?.divisions || []).map(d =>
    typeof d === "object" ? d.name : d
  );

  return eventos.filter(ev => {
    if (ev.tipo === "licencia")     return true;
    if (ev.tipo === "reunion_sapd") return true;
    if (ev.tipo === "reunion_jur")  return ev.jurisdiccion === userJur;
    if (ev.tipo === "evento_div")   return userDivs.includes(ev.division);
    return false;
  });
}

// ─── Dashboard View — Calendario Semanal ─────────────────────────────────────
function DashboardView({ currentUser }) {
  const hoy   = new Date();
  const [lunes, setLunes] = useState(() => getLunes(hoy));
  const semana = getSemana(lunes);

  // Ancla los eventos de ejemplo a la semana actual
  const lunesRef = getLunes(hoy);
  const todosEventos = EVENTOS_EJEMPLO.map(ev => {
    const fecha = new Date(lunesRef);
    fecha.setDate(lunesRef.getDate() + ev.diasOffset);
    return { ...ev, fecha };
  });

  // Filtra según el perfil del usuario
  const eventos = filtrarEventos(todosEventos, currentUser);

  const irSemanaAnterior = () => {
    const d = new Date(lunes);
    d.setDate(d.getDate() - 7);
    setLunes(d);
  };

  const irSemanaSiguiente = () => {
    const d = new Date(lunes);
    d.setDate(d.getDate() + 7);
    setLunes(d);
  };

  const irHoy = () => setLunes(getLunes(hoy));

  const domingo = semana[6];
  const tituloSemana =
    lunes.getMonth() === domingo.getMonth()
      ? `${lunes.getDate()} – ${domingo.getDate()} de ${MESES[lunes.getMonth()]} ${lunes.getFullYear()}`
      : `${lunes.getDate()} ${MESES[lunes.getMonth()]} – ${domingo.getDate()} ${MESES[domingo.getMonth()]} ${lunes.getFullYear()}`;

  const totalSemana = semana.reduce((acc, dia) =>
    acc + eventos.filter(ev => isSameDay(ev.fecha, dia)).length, 0);

  return (
    <div className="view cal-view">
      {/* Cabecera */}
      <div className="cal-header">
        <div>
          <div className="view-title">Actividades de la semana</div>
          <div className="view-sub">
            {tituloSemana} &nbsp;·&nbsp; {totalSemana} actividad{totalSemana !== 1 ? "es" : ""}
          </div>
        </div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={irHoy}>Hoy</button>
          <button className="cal-nav-btn icon" onClick={irSemanaAnterior}><IcoChevronLeft /></button>
          <button className="cal-nav-btn icon" onClick={irSemanaSiguiente}><IcoChevronRight /></button>
        </div>
      </div>

      {/* Leyenda de tipos */}
      <div className="cal-legend">
        {Object.entries(TIPO_STYLES).map(([key, val]) => (
          <span key={key} className="cal-legend-item" style={{ color: val.color }}>
            <span className="cal-legend-dot" style={{ background: val.color }} />
            {val.label}
          </span>
        ))}
      </div>

      {/* Grid de la semana */}
      <div className="cal-grid">
        {semana.map((dia, i) => {
          const esHoy     = isSameDay(dia, hoy);
          const evsDia    = eventos.filter(ev => isSameDay(ev.fecha, dia));
          const esPasado  = dia < hoy && !esHoy;

          return (
            <div key={i} className={`cal-col${esHoy ? " today" : ""}${esPasado ? " past" : ""}`}>
              {/* Cabecera del día */}
              <div className="cal-day-header">
                <span className="cal-day-name">{DIAS[i]}</span>
                <span className={`cal-day-num${esHoy ? " today-num" : ""}`}>
                  {dia.getDate()}
                </span>
                {evsDia.length > 0 && (
                  <span className="cal-day-count">{evsDia.length}</span>
                )}
              </div>

              {/* Eventos */}
              <div className="cal-events">
                {evsDia.length === 0 && (
                  <div className="cal-empty">Sin actividades</div>
                )}
                {evsDia.map(ev => {
                  const style = TIPO_STYLES[ev.tipo];
                  // Etiqueta secundaria según tipo
                  const tag =
                    ev.tipo === "licencia"    ? ev.subtipo :
                    ev.tipo === "reunion_jur" ? ev.jurisdiccion :
                    ev.tipo === "reunion_sapd"? "SAPD" :
                    ev.tipo === "evento_div"  ? ev.division : null;

                  return (
                    <div
                      key={ev.id}
                      className="cal-event"
                      style={{ borderLeftColor: style.color, background: style.bg }}
                    >
                      <div className="cal-event-title" style={{ color: style.color }}>
                        {ev.titulo}
                      </div>
                      <div className="cal-event-meta">
                        <span className="cal-event-hour">
                          <IcoClock /> {ev.hora}
                        </span>
                        {tag && (
                          <span className="cal-event-tag" style={{
                            background: `${style.color}22`,
                            color: style.color,
                            border: `1px solid ${style.color}44`,
                          }}>
                            {tag}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Policías View ────────────────────────────────────────────────────────────
function PoliciasView({ users }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = users.filter(u => {
    const matchesJur  = filter === "all" || u.jurisdiction === filter;
    const matchesName = (u.username || "").toLowerCase().includes(search.toLowerCase());
    return matchesJur && matchesName;
  });

  return (
    <div className="view">
      <div className="view-title">Policías</div>
      <div className="view-sub">Gestión de agentes del departamento</div>

      <div className="filters-bar">
        <div className="search-box">
          <IcoSearch />
          <input
            className="search-input"
            placeholder="Buscar agente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {[
            { id: "all",  label: "Todos" },
            { id: "LSPD", label: "LSPD"  },
            { id: "BCSO", label: "BCSO"  },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`filter-pill${filter === id ? " active" : ""}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="officers-grid">
        {filtered.map(user => <OfficerCard key={user._id} user={user} />)}
        {filtered.length === 0 && (
          <div className="empty-state full">
            <div className="empty-state-icon">🔍</div>
            No se encontraron agentes
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Divisiones View ──────────────────────────────────────────────────────────
const DIVISIONES_TRONCALES = [
  { name: "Detective Bureau",      acronym: "DB",    color: "blue",
    desc: "División de detectives encargada de la investigación criminal." },
  { name: "Metropolitan Division", acronym: "METRO", color: "red",
    desc: "División metropolitana de operaciones tácticas en zonas urbanas." },
];

const DIVISIONES_ADICIONALES = [
  { name: "Recruitment and Training Division",  acronym: "RTD",   color: "green",
    desc: "Gestión del reclutamiento y formación de nuevos agentes." },
  { name: "Air Support Division",               acronym: "ASD",   color: "blue",
    desc: "Unidad aérea de apoyo y vigilancia mediante helicópteros." },
  { name: "San Andreas Highway Patrol",         acronym: "SAHP",  color: "yellow",
    desc: "Patrulla y control de seguridad en las carreteras del estado." },
  { name: "Port Police Division",               acronym: "PPD",   color: "blue",
    desc: "Seguridad y vigilancia en el puerto y zonas costeras." },
  { name: "San Andreas State Prison Authority", acronym: "SASPA", color: "red",
    desc: "Autoridad penitenciaria del estado de San Andreas." },
  { name: "Psychology Division",                acronym: "PD",    color: "purple",
    desc: "Apoyo psicológico y evaluación de agentes del departamento." },
  { name: "Public Relation",                    acronym: "RRPP",  color: "green",
    desc: "Gestión de la imagen pública y comunicación del departamento." },
  { name: "K9 Unit",                            acronym: "K9",    color: "yellow",
    desc: "Unidad canina de apoyo en operaciones e investigación." },
  { name: "SSD (nombre pendiente)",             acronym: "SSD",   color: "blue",
    desc: "Descripción pendiente de confirmar." },
];

// Busca el logo de una división por su acrónimo (ej: "ASD.png", "asd.png", etc.)
function getDivisionLogo(acronym) {
  const key = Object.keys(divisionLogos).find(path =>
    path.toLowerCase().includes(`/${acronym.toLowerCase()}.`)
  );
  return key ? divisionLogos[key].default : null;
}

function DivisionCard({ div }) {
  const logoSrc = getDivisionLogo(div.acronym);

  return (
    <div className="division-card">
      <div className="division-card-top">
        {logoSrc ? (
          <img src={logoSrc} alt={div.acronym} className="division-logo" />
        ) : (
          <div className={`division-icon ${div.color}`}>
            <IcoDivision />
          </div>
        )}
        <span className="division-acronym">{div.acronym}</span>
      </div>
      <div className="division-name">{div.name}</div>
      <div className="division-desc">{div.desc}</div>
      <div className="division-count"><IcoUsers /> 0 miembros activos</div>
    </div>
  );
}

function DivisionesView() {
  return (
    <div className="view">
      <div className="view-title">Divisiones</div>
      <div className="view-sub">Unidades especializadas del departamento</div>

      <div className="div-section-label">
        <span>Divisiones troncales</span>
        <span className="div-section-note">⚠ Mutuamente excluyentes — un agente solo puede pertenecer a una</span>
      </div>
      <div className="divisions-grid troncal">
        {DIVISIONES_TRONCALES.map(div => <DivisionCard key={div.acronym} div={div} />)}
      </div>

      <div className="div-section-label" style={{ marginTop: 28 }}>
        <span>Divisiones adicionales</span>
        <span className="div-section-note">Combinables libremente entre sí</span>
      </div>
      <div className="divisions-grid">
        {DIVISIONES_ADICIONALES.map(div => <DivisionCard key={div.acronym} div={div} />)}
      </div>
    </div>
  );
}

// ─── Rangos View ──────────────────────────────────────────────────────────────
const RANKS = {
  LSPD: [
    { name: "Jefa SAPD",         sub: "Dirección general",       color: "red"    },
    { name: "Comisionado",        sub: "Alto mando LSPD",         color: "red"    },
    { name: "Capitán",            sub: "Mando intermedio",        color: "yellow" },
    { name: "Teniente",           sub: "Supervisión de unidades", color: "yellow" },
    { name: "Sargento",           sub: "Mando de patrulla",       color: "blue"   },
    { name: "Detective",          sub: "Investigación criminal",  color: "blue"   },
    { name: "Oficial",            sub: "Agente de calle",         color: "green"  },
    { name: "Agente en Prácticas",sub: "Periodo de formación",    color: "green"  },
  ],
  BCSO: [
    { name: "Sheriff",            sub: "Mando Blaine County SO",  color: "red"    },
    { name: "Subsheriff",         sub: "Segundo al mando",        color: "yellow" },
    { name: "Sargento SO",        sub: "Supervisión de unidad",   color: "blue"   },
    { name: "Deputy",             sub: "Agente de condado",       color: "green"  },
    { name: "Cadete SO",          sub: "Periodo de formación",    color: "green"  },
  ],
};

function RangosView() {
  return (
    <div className="view">
      <div className="view-title">Rangos</div>
      <div className="view-sub">Jerarquía del departamento por jurisdicción</div>

      {Object.entries(RANKS).map(([jur, ranks]) => (
        <div key={jur} className="ranks-section">
          <div className="ranks-section-title">
            <span className={`jur-badge ${jur.toLowerCase()}`}>{jur}</span>
          </div>
          <div className="ranks-list">
            {ranks.map((rank, i) => (
              <div key={rank.name} className="rank-item">
                <span className="rank-number">{i + 1}</span>
                <div className={`rank-icon stat-icon ${rank.color}`}><IcoStar /></div>
                <div className="rank-info">
                  <div className="rank-name">{rank.name}</div>
                  <div className="rank-sub">{rank.sub}</div>
                </div>
                <span className={`jur-badge ${jur.toLowerCase()}`}>{jur}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers]   = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => setUsers([]));
  }, []);

  // Simula usuario actual (en el futuro vendrá del auth)
  const currentUser = users[0] ?? { username: "Victor M.", jurisdiction: "LSPD" };

  const views = {
    dashboard:  <DashboardView  currentUser={currentUser} />,
    policias:   <PoliciasView   users={users} />,
    divisiones: <DivisionesView />,
    rangos:     <RangosView />,
  };

  return (
    <div className="app">
      <Sidebar active={active} setActive={setActive} currentUser={currentUser} />
      <div className="main">
        <Header active={active} currentUser={currentUser} />
        <div className="content">
          {views[active]}
        </div>
      </div>
    </div>
  );
}
