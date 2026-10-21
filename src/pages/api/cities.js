// src/pages/api/cities.js — city list CRUD
import { readCities, writeCities, json } from '../../lib/cities-store.js';

export const prerender = false;

// GET → full city list
export async function GET() {
	const cities = await readCities();
	return json(cities);
}

// POST → add a city  { name, country, lat, lon, year }
export async function POST({ request }) {
	let body;
	try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }

	const name = (body.name || '').trim();
	if (!name) return json({ error: 'name is required' }, 400);

	const cities = await readCities();
	if (cities.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
		return json({ error: `city "${name}" already exists` }, 409);
	}

	const year = (body.year || '').trim();
	cities.push({
		name,
		country: (body.country || '').trim(),
		lat: Number(body.lat) || 0,
		lon: Number(body.lon) || 0,
		years: year ? [{ year, photos: [] }] : [],
	});

	await writeCities(cities);
	return json({ ok: true, cities });
}

// DELETE → remove a city  { name }
export async function DELETE({ request }) {
	let body;
	try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }

	const name = (body.name || '').trim();
	if (!name) return json({ error: 'name is required' }, 400);

	const cities = await readCities();
	const next = cities.filter((c) => c.name !== name);
	if (next.length === cities.length) return json({ error: 'city not found' }, 404);

	await writeCities(next);
	return json({ ok: true, cities: next });
}
