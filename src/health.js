/* Liveness probe for the container: GET /health → 200 ok. */
export const loader = () => new Response('ok', { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } })
