/**
 * Genera una URL de foto de perfil consistente para un cuidador.
 * Usa randomuser.me con un seed basado en el nombre,
 * así siempre devuelve la misma foto para el mismo cuidador.
 */
export function getFotoCuidador(nombre) {
  const seed = encodeURIComponent(nombre.trim().toLowerCase().replace(/\s+/g, '-'));
  // randomuser.me permite seeds para obtener resultados reproducibles
  return `https://randomuser.me/api/portraits/med/${seed.charCodeAt(0) % 2 === 0 ? 'women' : 'men'}/${(seed.length * 7) % 100}.jpg`;
}

/**
 * Fallback: avatar con iniciales del nombre usando ui-avatars.
 */
export function getAvatarFallback(nombre) {
  const initials = nombre
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=FF8C42&color=fff&size=128&bold=true&rounded=true`;
}
