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
