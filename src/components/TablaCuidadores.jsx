import { useState } from 'react';
import { getFotoCuidador, getAvatarFallback } from '../services/fotosService';
import './TablaCuidadores.css';

const MASCOTAS_ICONS = ['🐶', '🐱', '🐾', '🦮', '🐩'];

/**
 * Devuelve un ícono de mascota determinista según el índice del cuidador.
 */
function iconMascota(index) {
  return MASCOTAS_ICONS[index % MASCOTAS_ICONS.length];
}

/**
 * Tarjeta individual de un cuidador.
 */
function CardCuidador({ cuidador, index }) {
  const [imgError, setImgError] = useState(false);
  const fotoUrl = getFotoCuidador(cuidador.nombre);
  const fallbackUrl = getAvatarFallback(cuidador.nombre);

  return (
    <article className="card-cuidador">
      <div className="card-foto-wrapper">
        <img
          className="card-foto"
          src={imgError ? fallbackUrl : fotoUrl}
          alt={`Foto de ${cuidador.nombre}`}
          onError={() => setImgError(true)}
        />
        <span className="card-mascota-icon" aria-hidden="true">
          {iconMascota(index)}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-nombre">{cuidador.nombre}</h3>

        <div className="card-tags">
          <span className="tag tag-ciudad">📍 {cuidador.ciudad}</span>
          <span className="tag tag-edad">🎂 {cuidador.edad} años</span>
        </div>

        <div className="card-info">
          <div className="card-info-row">
            <span className="info-icon">🕐</span>
            <span>{cuidador.disponibilidad}</span>
          </div>
          <div className="card-info-row">
            <span className="info-icon">📞</span>
            <span>{cuidador.celular}</span>
          </div>
        </div>

        <a
          className="btn-contactar"
          href={`tel:${cuidador.celular}`}
          aria-label={`Llamar a ${cuidador.nombre}`}
        >
          Contactar cuidador
        </a>
      </div>
    </article>
  );
}

/**
 * Grid de tarjetas de cuidadores.
 */
export default function TablaCuidadores({ cuidadores }) {
  if (!cuidadores || cuidadores.length === 0) {
    return (
      <div className="sin-resultados">
        <span className="sin-resultados-icon">🐾</span>
        <p>No encontramos cuidadores con ese filtro.</p>
        <p className="sin-resultados-hint">Intenta con otra ciudad o consulta sin filtro.</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {cuidadores.map((c, index) => (
        <CardCuidador key={index} cuidador={c} index={index} />
      ))}
    </div>
  );
}
