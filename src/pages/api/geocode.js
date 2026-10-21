// src/pages/api/geocode.js — Nominatim proxy (avoids CORS + sets User-Agent)
import { json } from '../../lib/cities-store.js';

export const prerender = false;

// GET /api/geocode?q=Paris, France  →  { lat, lon }
export async function GET({ url }) {
	const q = (url.searchParams.get('q') || '').trim();
	if (!q) return json({ error: 'query param "q" is required' }, 400);

	const endpoint =
		`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;

	let results;
	try {
		const res = await fetch(endpoint, { headers: { 'User-Agent': 'my-portfolio-app' } });
		if (!res.ok) return json({ error: `Nominatim HTTP ${res.status}` }, 502);
		results = await res.json();
	} catch (err) {
		return json({ error: `geocode failed: ${err.message}` }, 502);
	}

	if (!results.length) return json({ error: 'no results' }, 404);

	const round = (n) => Math.round(Number(n) * 1e5) / 1e5;
	return json({ lat: round(results[0].lat), lon: round(results[0].lon), display: results[0].display_name });
}
