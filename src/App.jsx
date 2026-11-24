import { useState } from 'react';
import { fetchCuidadores } from './services/cuidadoresService';
import TablaCuidadores from './components/TablaCuidadores';
import ModalRegistro from './components/ModalRegistro';
import './App.css';

const DISPONIBILIDAD_OPCIONES = [
  '24/7 todos los días',
  'Fines de semana 24/7',
  'Lunes a viernes',
  'Solo fines de semana',
  'Tardes y noches',
  'A convenir',
];

const TAMAÑOS_OPCIONES = [
  'Pequeño (hasta 10 kg)',
  'Mediano (10 a 25 kg)',
  'Grande (más de 25 kg)',
  'Todos los tamaños',
];

const ACTIVIDAD_OPCIONES = [
  'Bajo',
  'Moderado',
  'Alto',
  'Muy alto',
];

export default function App() {
  const [todosLosCuidadores, setTodosLosCuidadores] = useState([]);
  const [cuidadoresFiltrados, setCuidadoresFiltrados] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [actividad, setActividad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [consultado, setConsultado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const aplicarFiltros = (lista, fCiudad, fDisp, fTamaño, fActividad) => {
    return lista.filter((c) => {
      const okCiudad    = !fCiudad.trim()   || c.ciudad.toLowerCase().includes(fCiudad.trim().toLowerCase());
      const okDisp      = !fDisp             || c.disponibilidad === fDisp;
      const okTamaño    = !fTamaño           || c.tamañosAceptados === fTamaño || c.tamañosAceptados === 'Todos los tamaños';
      const okActividad = !fActividad        || c.nivelActividad === fActividad;
      return okCiudad && okDisp && okTamaño && okActividad;
    });
  };

  const handleConsultar = async () => {
    setCargando(true);
    setError(null);
    setConsultado(false);
    try {
      const { cuidadores: data } = await fetchCuidadores();
      setTodosLosCuidadores(data);
      setCuidadoresFiltrados(aplicarFiltros(data, ciudad, disponibilidad, tamaño, actividad));
      setConsultado(true);
    } catch (err) {
      setError(err.message || 'Error desconocido.');
    } finally {
      setCargando(false);
    }
  };

  const recalcular = (fCiudad, fDisp, fTamaño, fActividad) => {
    if (consultado) setCuidadoresFiltrados(aplicarFiltros(todosLosCuidadores, fCiudad, fDisp, fTamaño, fActividad));
  };

  const handleLimpiar = () => {
    setCiudad(''); setDisponibilidad(''); setTamaño(''); setActividad('');
    if (consultado) setCuidadoresFiltrados(todosLosCuidadores);
  };

  const handleRegistrado = (nuevo) => {
    const lista = [...todosLosCuidadores, nuevo];
    setTodosLosCuidadores(lista);
    setCuidadoresFiltrados(aplicarFiltros(lista, ciudad, disponibilidad, tamaño, actividad));
    setConsultado(true);
  };

  const count = cuidadoresFiltrados.length;
  const hayFiltros = ciudad.trim() || disponibilidad || tamaño || actividad;

  return (
    <div className="app-container">

      {/* Huskys decorativos — silueta lateral */}
      <svg className="husky-deco husky-deco-left" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="#ff8c42">
          {/* cuerpo principal */}
          <path d="M40,200 C30,195 20,180 22,160 C24,140 35,125 55,118 C70,113 90,112 110,115 C135,118 158,125 170,140 C182,155 180,175 170,188 C160,200 140,208 115,210 C90,212 55,208 40,200 Z"/>
          {/* cuello */}
          <path d="M110,115 C105,100 100,85 105,72 C108,63 118,58 128,60 C138,62 142,70 140,82 C138,95 132,108 122,115 Z"/>
          {/* cabeza */}
          <path d="M105,72 C100,55 102,42 112,34 C120,27 134,26 144,32 C154,38 158,50 155,62 C152,74 143,82 132,84 C121,86 110,80 105,72 Z"/>
          {/* oreja izquierda */}
          <path d="M112,34 C108,26 106,14 112,8 C116,4 122,6 126,12 C130,18 128,28 124,34 Z"/>
          {/* oreja derecha */}
          <path d="M134,30 C132,22 134,12 140,8 C145,4 150,8 152,15 C154,22 150,30 144,33 Z"/>
          {/* hocico */}
          <path d="M105,72 C98,68 92,65 90,70 C88,75 92,82 100,84 C106,85 110,80 108,75 Z"/>
          {/* cola enroscada hacia arriba */}
          <path d="M170,145 C188,135 205,120 208,102 C211,85 200,72 188,74 C178,76 172,88 175,102 C177,112 182,122 178,133 C175,140 170,145 165,148 Z"/>
          {/* pata delantera izq */}
          <path d="M75,208 C72,210 68,220 70,230 C72,238 78,240 82,236 C86,232 86,222 84,212 Z"/>
          {/* pata delantera der */}
          <path d="M100,210 C97,212 93,222 95,232 C97,240 103,242 107,238 C111,234 111,224 109,214 Z"/>
          {/* pata trasera izq */}
          <path d="M130,208 C128,215 130,228 134,235 C138,240 144,238 146,230 C148,222 144,212 138,208 Z"/>
          {/* pata trasera der */}
          <path d="M152,205 C150,212 152,224 156,230 C160,236 166,234 168,226 C170,218 166,208 160,204 Z"/>
        </g>
      </svg>

      <svg className="husky-deco husky-deco-right" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="#e8622a">
          <path d="M40,200 C30,195 20,180 22,160 C24,140 35,125 55,118 C70,113 90,112 110,115 C135,118 158,125 170,140 C182,155 180,175 170,188 C160,200 140,208 115,210 C90,212 55,208 40,200 Z"/>
          <path d="M110,115 C105,100 100,85 105,72 C108,63 118,58 128,60 C138,62 142,70 140,82 C138,95 132,108 122,115 Z"/>
          <path d="M105,72 C100,55 102,42 112,34 C120,27 134,26 144,32 C154,38 158,50 155,62 C152,74 143,82 132,84 C121,86 110,80 105,72 Z"/>
          <path d="M112,34 C108,26 106,14 112,8 C116,4 122,6 126,12 C130,18 128,28 124,34 Z"/>
          <path d="M134,30 C132,22 134,12 140,8 C145,4 150,8 152,15 C154,22 150,30 144,33 Z"/>
          <path d="M105,72 C98,68 92,65 90,70 C88,75 92,82 100,84 C106,85 110,80 108,75 Z"/>
          <path d="M170,145 C188,135 205,120 208,102 C211,85 200,72 188,74 C178,76 172,88 175,102 C177,112 182,122 178,133 C175,140 170,145 165,148 Z"/>
          <path d="M75,208 C72,210 68,220 70,230 C72,238 78,240 82,236 C86,232 86,222 84,212 Z"/>
          <path d="M100,210 C97,212 93,222 95,232 C97,240 103,242 107,238 C111,234 111,224 109,214 Z"/>
          <path d="M130,208 C128,215 130,228 134,235 C138,240 144,238 146,230 C148,222 144,212 138,208 Z"/>
          <path d="M152,205 C150,212 152,224 156,230 C160,236 166,234 168,226 C170,218 166,208 160,204 Z"/>
        </g>
      </svg>
      <header className="app-header">
        <span className="app-header-logo" aria-hidden="true">🐾</span>
        <h1>Una Huella en Común</h1>
        <p className="app-subtitle">Encontrá al cuidador perfecto para tu mascota</p>
      </header>

      <main>
        <section className="search-panel" aria-label="Filtrar cuidadores">
          <p className="search-panel-title">🔍 Filtrar cuidadores</p>

          <div className="filtro-grid">

            {/* Ciudad */}
            <div className="input-wrapper">
              <label htmlFor="ciudad-input" className="input-label">📍 Ciudad</label>
              <div className="input-inner">
                <input id="ciudad-input" type="text" className="input-field"
                  placeholder="Ej: Pereira, Bogotá..."
                  value={ciudad}
                  onChange={(e) => { setCiudad(e.target.value); recalcular(e.target.value, disponibilidad, tamaño, actividad); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                />
                {ciudad && (
                  <button className="btn-clear-input" onClick={() => { setCiudad(''); recalcular('', disponibilidad, tamaño, actividad); }}>✕</button>
                )}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="input-wrapper">
              <label htmlFor="disp-select" className="input-label">🕐 Disponibilidad</label>
              <select id="disp-select" className="input-field" value={disponibilidad}
                onChange={(e) => { setDisponibilidad(e.target.value); recalcular(ciudad, e.target.value, tamaño, actividad); }}>
                <option value="">Todas</option>
                {DISPONIBILIDAD_OPCIONES.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

            {/* Tamaño del perro */}
            <div className="input-wrapper">
              <label htmlFor="tamaño-select" className="input-label">📏 Tamaño del perro</label>
              <select id="tamaño-select" className="input-field" value={tamaño}
                onChange={(e) => { setTamaño(e.target.value); recalcular(ciudad, disponibilidad, e.target.value, actividad); }}>
                <option value="">Todos los tamaños</option>
                {TAMAÑOS_OPCIONES.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

            {/* Nivel de actividad */}
            <div className="input-wrapper">
              <label htmlFor="actividad-select" className="input-label">⚡ Nivel de actividad</label>
              <select id="actividad-select" className="input-field" value={actividad}
                onChange={(e) => { setActividad(e.target.value); recalcular(ciudad, disponibilidad, tamaño, e.target.value); }}>
                <option value="">Cualquier nivel</option>
                {ACTIVIDAD_OPCIONES.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>

          </div>

          {/* Acciones */}
          <div className="filtro-acciones" style={{ marginTop: '1rem' }}>
            <button className="btn-consultar" onClick={handleConsultar} disabled={cargando}>
              {cargando ? <><span className="spinner" aria-hidden="true"/> Buscando...</> : '🐶 Buscar cuidadores'}
            </button>
            {hayFiltros && (
              <button className="btn-limpiar-todo" onClick={handleLimpiar}>✕ Limpiar filtros</button>
            )}
            <button className="btn-registrar-header" onClick={() => setMostrarModal(true)}>
              ✚ Registrarme
            </button>
          </div>

          {consultado && (
            <div className="resultados-bar">
              <span className="badge-count">
                {count} {count === 1 ? 'cuidador encontrado' : 'cuidadores encontrados'}
                {hayFiltros && <span className="badge-filtro"> · con filtros activos</span>}
              </span>
              {hayFiltros && <button className="link-limpiar" onClick={handleLimpiar}>Ver todos</button>}
            </div>
          )}
        </section>

        {error && (
          <div className="alert-error" role="alert"><strong>Error:</strong> {error}</div>
        )}

        {consultado && !error && <TablaCuidadores cuidadores={cuidadoresFiltrados} />}

        {!consultado && !error && !cargando && (
          <div className="estado-inicial">
            <span className="estado-inicial-icon" aria-hidden="true">🦮</span>
            <p>Usa los filtros y presiona <strong>Buscar cuidadores</strong>, o deja todo vacío para ver todos.</p>
            <p className="estado-inicial-registro">
              ¿Quieres cuidar mascotas?{' '}
              <button className="link-registro" onClick={() => setMostrarModal(true)}>Regístrate aquí</button>
            </p>
          </div>
        )}
      </main>

      {mostrarModal && (
        <ModalRegistro
          onClose={() => setMostrarModal(false)}
          onRegistrado={(nuevo) => { handleRegistrado(nuevo); setMostrarModal(false); }}
        />
      )}
    </div>
  );
}
