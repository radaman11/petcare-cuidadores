const API_URL = 'https://xvcrgx53f0.execute-api.us-east-2.amazonaws.com/cuidadores';

/**
 * Obtiene la lista de cuidadores desde API Gateway → Lambda → DynamoDB.
 */
export async function fetchCuidadores() {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error al consultar cuidadores: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const cuidadores = (data.Items || []).map((item) => ({
    id:               item.id               ?? '',
    nombre:           item.nombre           ?? '',
    edad:             item.edad             ?? '',
    disponibilidad:   item.disponibilidad   ?? '',
    celular:          item.celular          ?? '',
    ciudad:           item.ciudad           ?? '',
    experiencia:      item.experiencia      ?? '',
    servicios:        item.servicios        ?? '',
    espacioCuidado:   item.espacioCuidado   ?? '',
    tamañosAceptados: item.tamañosAceptados ?? '',
    nivelActividad:   item.nivelActividad   ?? '',
  }));

  return { cuidadores, count: data.Count ?? cuidadores.length };
}

/**
 * Registra un nuevo cuidador en DynamoDB vía API Gateway → Lambda.
 */
export async function registrarCuidador(cuidador) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      nombre:           cuidador.nombre.trim(),
      edad:             Number(cuidador.edad),
      disponibilidad:   cuidador.disponibilidad.trim(),
      celular:          cuidador.celular.trim(),
      ciudad:           cuidador.ciudad.trim(),
      experiencia:      cuidador.experiencia.trim(),
      servicios:        cuidador.servicios.trim(),
      espacioCuidado:   cuidador.espacioCuidado.trim(),
      tamañosAceptados: cuidador.tamañosAceptados.trim(),
      nivelActividad:   cuidador.nivelActividad.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Error al registrar: ${response.status} ${response.statusText}`);
  }

  return true;
}
