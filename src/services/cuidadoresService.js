const API_URL = 'https://cuidadores.free.beeceptor.com/dynamoCuidadores';

/**
 * Obtiene la lista de cuidadores desde el mock de Beeceptor.
 * Los campos vienen en formato DynamoDB: { S: "valor" } o { N: "número" }
 */
export async function fetchCuidadores() {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error al consultar cuidadores: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Normalizar el formato DynamoDB a objetos planos
  const cuidadores = (data.Items || []).map((item) => ({
    nombre: item.nombre?.S ?? '',
    edad: item.edad?.N ?? '',
    disponibilidad: item.disponibilidad?.S ?? '',
    celular: item.celular?.N ?? '',
    ciudad: item.ciudad?.S ?? '',
  }));

  return { cuidadores, count: data.Count ?? cuidadores.length };
}

/**
 * Registra un nuevo cuidador.
 * En producción: cambiar API_URL por el endpoint real de API Gateway.
 * El mock de Beeceptor acepta el POST y responde con éxito.
 */
export async function registrarCuidador(cuidador) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      nombre: cuidador.nombre.trim(),
      edad: Number(cuidador.edad),
      disponibilidad: cuidador.disponibilidad.trim(),
      celular: cuidador.celular.trim(),
      ciudad: cuidador.ciudad.trim(),
    }),
  });

  // Beeceptor mock devuelve 200 aunque el body sea vacío — lo tratamos como éxito
  if (!response.ok) {
    throw new Error(`Error al registrar: ${response.status} ${response.statusText}`);
  }

  return true;
}
