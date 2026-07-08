// Utilitário do "Mural de Campanha" — variação de rotação/deslocamento dos
// cards nas 4 seções de conteúdo da home, pra simular painéis afixados com
// tamanhos e ângulos diferentes. Ciclo por índice, não por card.id, então a
// disposição fica estável entre renders.

const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'] as const;
const OFFSETS = ['sm:mt-0', 'sm:mt-8', 'sm:mt-3', 'sm:mt-10'] as const;

export function muralRotation(index: number): string {
  return ROTATIONS[index % ROTATIONS.length] ?? ROTATIONS[0];
}

export function muralOffset(index: number): string {
  return OFFSETS[index % OFFSETS.length] ?? OFFSETS[0];
}
