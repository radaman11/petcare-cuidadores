import { useState } from 'react';
import { fetchCuidadores } from './services/cuidadoresService';
import TablaCuidadores from './components/TablaCuidadores';
import ModalRegistro from './components/ModalRegistro';
import './App.css';

export default function App() {
  const [todosLosCuidadores, setTodosLosCuidadores] = useState([]);
  const [cuidadoresFiltrados, setCuidadoresFiltrados] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [consultado, setConsultado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const filtrarPorCiudad = (lista, termino) => {
    if (!termino.trim()) return lista;
    const terminoNorm = termino.trim().toLowerCase();
    return lista.filter((c) =>
      c.ciudad.toLowerCase().includes(terminoNorm)
    );
  };

  const handleConsultar = async () => {
    setCargando(true);
    setError(null);
    setConsultado(false);

    try {
      const { cuidadores: data } = await fetchCuidadores();
      setTodosLosCuidadores(data);
      setCuidadoresFiltrados(filtrarPorCiudad(data, ciudad));
      setConsultado(true);
    } catch (err) {
      setError(err.message || 'Error desconocido al consultar los datos.');
    } finally {
      setCargando(false);
    }
  };

  const handleCiudadChange = (e) => {
    const valor = e.target.value;
    setCiudad(valor);
    if (consultado) {
      setCuidadoresFiltrados(filtrarPorCiudad(todosLosCuidadores, valor));
    }
  };

  const handleLimpiar = () => {
    setCiudad('');
    if (consultado) {
      setCuidadoresFiltrados(todosLosCuidadores);
    }
  };

  /**
   * Cuando se registra un nuevo cuidador, lo agregamos al estado local
   * para que aparezca de inmediato sin requerir una nueva consulta.
   */
  const handleRegistrado = (nuevoCuidador) => {
    const listaActualizada = [...todosLosCuidadores, nuevoCuidador];
    setTodosLosCuidadores(listaActualizada);
    setCuidadoresFiltrados(filtrarPorCiudad(listaActualizada, ciudad));
    setConsultado(true);
  };

  const count = cuidadoresFiltrados.length;

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-header-logo" aria-hidden="true">🐾</span>
        <h1>PetCare — Cuidadores</h1>
        <p className="app-subtitle">Encontrá al cuidador perfecto para tu mascota</p>
      </header>

      <main>
        {/* Panel de búsqueda */}
        <section className="search-panel" aria-label="Buscar cuidadores">
          <p className="search-panel-title">🔍 Buscar por ciudad</p>

          <div className="filtro-bar">
            <div className="input-wrapper">
              <label htmlFor="ciudad-input" className="input-label">Ciudad</label>
              <input
                id="ciudad-input"
                type="text"
                className="input-ciudad"
                placeholder="Ej: Pereira, Armenia..."
                value={ciudad}
                onChange={handleCiudadChange}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
              />
              {ciudad && (
                <button className="btn-limpiar" onClick={handleLimpiar} aria-label="Limpiar filtro">
                  ✕
                </button>
              )}
            </div>

            <button
              className="btn-consultar"
              onClick={handleConsultar}
              disabled={cargando}
            >
              {cargando ? (
                <><span className="spinner" aria-hidden="true" /> Buscando...</>
              ) : (
                '🐶 Buscar cuidadores'
              )}
            </button>

            <button
              className="btn-registrar-header"
              onClick={() => setMostrarModal(true)}
            >
              ✚ Registrarme
            </button>

            {consultado && (
              <span className="badge-count">
                {count} {count === 1 ? 'cuidador' : 'cuidadores'}
                {ciudad.trim() && (
                  <span className="badge-ciudad"> en &quot;{ciudad.trim()}&quot;</span>
                )}
              </span>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="alert-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Resultados */}
        {consultado && !error && (
          <TablaCuidadores cuidadores={cuidadoresFiltrados} />
        )}

        {/* Estado inicial */}
        {!consultado && !error && !cargando && (
          <div className="estado-inicial">
            <span className="estado-inicial-icon" aria-hidden="true">🦮</span>
            <p>
              Escribe una ciudad y presiona <strong>Buscar cuidadores</strong>,<br />
              o deja el campo vacío para ver todos.
            </p>
            <p className="estado-inicial-registro">
              ¿Quieres cuidar mascotas?{' '}
              <button className="link-registro" onClick={() => setMostrarModal(true)}>
                Regístrate aquí
              </button>
            </p>
          </div>
        )}
      </main>

      {/* Modal de registro */}
      {mostrarModal && (
        <ModalRegistro
          onClose={() => setMostrarModal(false)}
          onRegistrado={(nuevo) => {
            handleRegistrado(nuevo);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}
