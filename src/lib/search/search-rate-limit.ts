const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

// Limitador em memória (sem tabela dedicada, ao contrário de login/leads):
// busca não grava nada no banco, então não há um registro natural pra contar
// contra — e o volume esperado (site de campanha de um único candidato,
// processo único, sem múltiplas instâncias) não justifica um Redis só pra
// isso. Cresce com o nº de IPs distintos vistos desde o último restart do
// processo; aceitável nessa escala (ver README > Segurança).
const hits = new Map<string, number[]>();

/** Limite de requisições a /api/search por IP (janela deslizante). */
export function isSearchRateLimited(ipAddress: string | null): boolean {
  if (!ipAddress) return false;

  const now = Date.now();
  const recent = (hits.get(ipAddress) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ipAddress, recent);
    return true;
  }

  recent.push(now);
  hits.set(ipAddress, recent);
  return false;
}
