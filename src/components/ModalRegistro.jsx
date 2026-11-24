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

const EXPERIENCIA_OPCIONES = [
  'Menos de 1 año',
  '1 a 3 años',
  '3 a 5 años',
  'Más de 5 años',
];

const SERVICIOS_OPCIONES = [
  'Cuidado en casa del cuidador',
  'Visitas a domicilio',
  'Paseos',
  'Guardería nocturna',
];

const ESPACIO_OPCIONES = [
  'Apartamento',
  'Casa sin jardín',
  'Casa con jardín',
  'Finca',
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

const CAMPOS_INICIALES = {
  nombre: '',
  edad: '',
  ciudad: '',
  celular: '',
  disponibilidad: '',
  experiencia: '',
  servicios: '',
  espacioCuidado: '',
  tamañosAceptados: '',
  nivelActividad: '',
};

function validar(campos) {
  const errores = {};

  if (!campos.nombre.trim()) errores.nombre = 'El nombre es requerido.';
  else if (campos.nombre.trim().length < 3) errores.nombre = 'Mínimo 3 caracteres.';

  const edad = Number(campos.edad);
  if (!campos.edad) errores.edad = 'La edad es requerida.';
  else if (isNaN(edad) || edad < 18 || edad > 80) errores.edad = 'Debe ser entre 18 y 80.';

  if (!campos.ciudad.trim()) errores.ciudad = 'La ciudad es requerida.';

  const cel = campos.celular.replace(/\D/g, '');
  if (!campos.celular) errores.celular = 'El celular es requerido.';
  else if (cel.length < 7) errores.celular = 'Número inválido.';

  if (!campos.disponibilidad) errores.disponibilidad = 'Selecciona disponibilidad.';
  if (!campos.experiencia) errores.experiencia = 'Selecciona experiencia.';
  if (!campos.servicios) errores.servicios = 'Selecciona un servicio.';
  if (!campos.espacioCuidado) errores.espacioCuidado = 'Selecciona el espacio.';
  if (!campos.tamañosAceptados) errores.tamañosAceptados = 'Selecciona tamaños.';
  if (!campos.nivelActividad) errores.nivelActividad = 'Selecciona nivel de actividad.';

  return errores;
}

export default function ModalRegistro({ onClose, onRegistrado }) {
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const primerCampoRef = useRef(null);

  useEffect(() => {
    primerCampoRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
      onRegistrado({
        nombre:          campos.nombre.trim(),
        edad:            campos.edad,
        ciudad:          campos.ciudad.trim(),
        celular:         campos.celular.trim(),
        disponibilidad:  campos.disponibilidad,
        experiencia:     campos.experiencia,
        servicios:       campos.servicios,
        espacioCuidado:  campos.espacioCuidado,
        tamañosAceptados: campos.tamañosAceptados,
        nivelActividad:  campos.nivelActividad,
      });
    } catch (err) {
      setErrores({ _general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  const Select = ({ id, name, opciones, placeholder }) => (
    <select
      id={id}
      name={name}
      value={campos[name]}
      onChange={handleChange}
      className={errores[name] ? 'input-error' : ''}
    >
      <option value="">{placeholder}</option>
      {opciones.map((op) => <option key={op} value={op}>{op}</option>)}
    </select>
  );

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        <div className="modal-header">
          <span className="modal-emoji" aria-hidden="true">🐾</span>
          <div>
            <h2 id="modal-titulo" className="modal-titulo">Registro de cuidador</h2>
            <p className="modal-subtitulo">Únete a nuestra comunidad pet-friendly</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

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

            {/* Sección: Datos personales */}
            <p className="form-seccion">👤 Datos personales</p>

            <div className="form-group">
              <label htmlFor="reg-nombre">Nombre completo</label>
              <input ref={primerCampoRef} id="reg-nombre" name="nombre" type="text"
                placeholder="Ej: María García" value={campos.nombre} onChange={handleChange}
                className={errores.nombre ? 'input-error' : ''} autoComplete="name"/>
              {errores.nombre && <span className="form-error-msg">{errores.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-edad">Edad</label>
                <input id="reg-edad" name="edad" type="number" placeholder="Ej: 25"
                  min="18" max="80" value={campos.edad} onChange={handleChange}
                  className={errores.edad ? 'input-error' : ''}/>
                {errores.edad && <span className="form-error-msg">{errores.edad}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="reg-ciudad">Ciudad</label>
                <input id="reg-ciudad" name="ciudad" type="text" placeholder="Ej: Medellín"
                  value={campos.ciudad} onChange={handleChange}
                  className={errores.ciudad ? 'input-error' : ''}/>
                {errores.ciudad && <span className="form-error-msg">{errores.ciudad}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-celular">Celular</label>
              <input id="reg-celular" name="celular" type="tel" placeholder="Ej: 3001234567"
                value={campos.celular} onChange={handleChange}
                className={errores.celular ? 'input-error' : ''} autoComplete="tel"/>
              {errores.celular && <span className="form-error-msg">{errores.celular}</span>}
            </div>

            {/* Sección: Perfil profesional */}
            <p className="form-seccion">🐶 Perfil profesional</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-experiencia">Experiencia</label>
                <Select id="reg-experiencia" name="experiencia" opciones={EXPERIENCIA_OPCIONES} placeholder="Selecciona..."/>
                {errores.experiencia && <span className="form-error-msg">{errores.experiencia}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="reg-disponibilidad">Disponibilidad</label>
                <Select id="reg-disponibilidad" name="disponibilidad" opciones={DISPONIBILIDAD_OPCIONES} placeholder="Selecciona..."/>
                {errores.disponibilidad && <span className="form-error-msg">{errores.disponibilidad}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-servicios">Servicio principal</label>
                <Select id="reg-servicios" name="servicios" opciones={SERVICIOS_OPCIONES} placeholder="Selecciona..."/>
                {errores.servicios && <span className="form-error-msg">{errores.servicios}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="reg-espacio">Espacio de cuidado</label>
                <Select id="reg-espacio" name="espacioCuidado" opciones={ESPACIO_OPCIONES} placeholder="Selecciona..."/>
                {errores.espacioCuidado && <span className="form-error-msg">{errores.espacioCuidado}</span>}
              </div>
            </div>

            {/* Sección: Tipos de perros */}
            <p className="form-seccion">🦮 Tipos de perros que acepta</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-tamaños">Tamaño aceptado</label>
                <Select id="reg-tamaños" name="tamañosAceptados" opciones={TAMAÑOS_OPCIONES} placeholder="Selecciona..."/>
                {errores.tamañosAceptados && <span className="form-error-msg">{errores.tamañosAceptados}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="reg-actividad">Nivel de actividad</label>
                <Select id="reg-actividad" name="nivelActividad" opciones={ACTIVIDAD_OPCIONES} placeholder="Selecciona..."/>
                {errores.nivelActividad && <span className="form-error-msg">{errores.nivelActividad}</span>}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancelar" onClick={onClose} disabled={enviando}>
                Cancelar
              </button>
              <button type="submit" className="btn-registrar" disabled={enviando}>
                {enviando
                  ? <><span className="spinner spinner-dark" aria-hidden="true"/> Registrando...</>
                  : '🐶 Registrarme'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
