import { useState, useEffect, useRef } from 'react';
import { registrarCuidador } from '../services/cuidadoresService';
import './ModalRegistro.css';

const DISPONIBILIDAD_OPCIONES = [
  '24/7 todos los días',
  'Fines de semana 24/7',
  'Lunes a viernes',
  'Solo fines de semana',
  'Tardes y noches',
  'A convenir',
];

const CAMPOS_INICIALES = {
  nombre: '',
  edad: '',
  ciudad: '',
  celular: '',
  disponibilidad: '',
};

function validar(campos) {
  const errores = {};
  if (!campos.nombre.trim()) errores.nombre = 'El nombre es requerido.';
  else if (campos.nombre.trim().length < 3) errores.nombre = 'Mínimo 3 caracteres.';

  const edad = Number(campos.edad);
  if (!campos.edad) errores.edad = 'La edad es requerida.';
  else if (isNaN(edad) || edad < 18 || edad > 80)
    errores.edad = 'Debe ser un número entre 18 y 80.';

  if (!campos.ciudad.trim()) errores.ciudad = 'La ciudad es requerida.';

  const cel = campos.celular.replace(/\D/g, '');
  if (!campos.celular) errores.celular = 'El celular es requerido.';
  else if (cel.length < 7) errores.celular = 'Número inválido.';

  if (!campos.disponibilidad) errores.disponibilidad = 'Selecciona una disponibilidad.';

  return errores;
}

export default function ModalRegistro({ onClose, onRegistrado }) {
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const primerCampoRef = useRef(null);

  // Foco al abrir y bloquear scroll del body
  useEffect(() => {
    primerCampoRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(campos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviando(true);
    try {
      await registrarCuidador(campos);
      setExito(true);
      // Notificar al padre para agregar el cuidador localmente
      onRegistrado({
        nombre: campos.nombre.trim(),
        edad: campos.edad,
        ciudad: campos.ciudad.trim(),
        celular: campos.celular.trim(),
        disponibilidad: campos.disponibilidad,
      });
    } catch (err) {
      setErrores({ _general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <span className="modal-emoji" aria-hidden="true">🐾</span>
          <div>
            <h2 id="modal-titulo" className="modal-titulo">Registro de cuidador</h2>
            <p className="modal-subtitulo">Únete a nuestra comunidad pet-friendly</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar formulario">✕</button>
        </div>

        {/* Éxito */}
        {exito ? (
          <div className="modal-exito">
            <span className="exito-icon" aria-hidden="true">🎉</span>
            <h3>¡Registro exitoso!</h3>
            <p>Ya apareces en el directorio de cuidadores.</p>
            <button className="btn-exito" onClick={onClose}>Ver directorio</button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>

            {errores._general && (
              <div className="form-error-general" role="alert">{errores._general}</div>
            )}

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="reg-nombre">Nombre completo</label>
              <input
                ref={primerCampoRef}
                id="reg-nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María García"
                value={campos.nombre}
                onChange={handleChange}
                className={errores.nombre ? 'input-error' : ''}
                autoComplete="name"
              />
              {errores.nombre && <span className="form-error-msg">{errores.nombre}</span>}
            </div>

            {/* Edad + Ciudad en fila */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-edad">Edad</label>
                <input
                  id="reg-edad"
                  name="edad"
                  type="number"
                  placeholder="Ej: 25"
                  min="18"
                  max="80"
                  value={campos.edad}
                  onChange={handleChange}
                  className={errores.edad ? 'input-error' : ''}
                />
                {errores.edad && <span className="form-error-msg">{errores.edad}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reg-ciudad">Ciudad</label>
                <input
                  id="reg-ciudad"
                  name="ciudad"
                  type="text"
                  placeholder="Ej: Medellín"
                  value={campos.ciudad}
                  onChange={handleChange}
                  className={errores.ciudad ? 'input-error' : ''}
                />
                {errores.ciudad && <span className="form-error-msg">{errores.ciudad}</span>}
              </div>
            </div>

            {/* Celular */}
            <div className="form-group">
              <label htmlFor="reg-celular">Celular</label>
              <input
                id="reg-celular"
                name="celular"
                type="tel"
                placeholder="Ej: 3001234567"
                value={campos.celular}
                onChange={handleChange}
                className={errores.celular ? 'input-error' : ''}
                autoComplete="tel"
              />
              {errores.celular && <span className="form-error-msg">{errores.celular}</span>}
            </div>

            {/* Disponibilidad */}
            <div className="form-group">
              <label htmlFor="reg-disponibilidad">Disponibilidad</label>
              <select
                id="reg-disponibilidad"
                name="disponibilidad"
                value={campos.disponibilidad}
                onChange={handleChange}
                className={errores.disponibilidad ? 'input-error' : ''}
              >
                <option value="">Selecciona una opción...</option>
                {DISPONIBILIDAD_OPCIONES.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              {errores.disponibilidad && <span className="form-error-msg">{errores.disponibilidad}</span>}
            </div>

            {/* Acciones */}
            <div className="modal-actions">
              <button type="button" className="btn-cancelar" onClick={onClose} disabled={enviando}>
                Cancelar
              </button>
              <button type="submit" className="btn-registrar" disabled={enviando}>
                {enviando ? (
                  <><span className="spinner spinner-dark" aria-hidden="true" /> Registrando...</>
                ) : (
                  '🐶 Registrarme'
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
