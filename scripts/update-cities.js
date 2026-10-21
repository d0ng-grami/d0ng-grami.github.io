// scripts/update-cities.js
//
// Fills in missing coordinates for cities in src/data/album-cities.js.
// Any city whose lat/lon is missing or 0 gets geocoded via the Nominatim
// (OpenStreetMap) API, and the data file is rewritten in place.
//
// Usage:
//   node scripts/update-cities.js
//
// Add a new city with placeholder coords and run the script to fill them:
//   { name: "Paris", country: "France", lat: 0, lon: 0, years: [...] }

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../src/data/album-cities.js');

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'my-portfolio-app';

// ── Helpers ────────────────────────────────────────────────────────────

// A city needs coords if lat or lon is missing, non-numeric, or 0.
function needsCoords(city) {
	return !city.lat || !city.lon;
}

// Query Nominatim for one city. Returns { lat, lon } or null.
async function geocode(city) {
	// Include country (when present) to disambiguate names like "Florida".
	const query = city.country ? `${city.name}, ${city.country}` : city.name;
	const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1`;

	const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
	if (!res.ok) throw new Error(`HTTP ${res.status} for "${query}"`);

	const results = await res.json();
	if (!results.length) return null;

	const round = (n) => Math.round(Number(n) * 1e5) / 1e5;
	return { lat: round(results[0].lat), lon: round(results[0].lon) };
}

// Serialize the cities array back to a JS module literal (unquoted keys,
// 2-space indent) so the file stays human-readable and importable.
function serialize(value, indent = 0) {
	const pad = '\t'.repeat(indent);
	const padIn = '\t'.repeat(indent + 1);

	if (Array.isArray(value)) {
		if (value.length === 0) return '[]';
		const items = value.map((v) => padIn + serialize(v, indent + 1));
		return `[\n${items.join(',\n')}\n${pad}]`;
	}
	if (value && typeof value === 'object') {
		const keys = Object.keys(value);
		if (keys.length === 0) return '{}';
		const items = keys.map((k) => `${padIn}${k}: ${serialize(value[k], indent + 1)}`);
		return `{\n${items.join(',\n')}\n${pad}}`;
	}
	if (typeof value === 'string') return JSON.stringify(value);
	return String(value);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
	// 1. Load the albumCities array (dynamic import; ESM-safe on Windows).
	const mod = await import(pathToFileURL(DATA_PATH).href);
	const cities = mod.albumCities;
	if (!Array.isArray(cities)) {
		throw new Error('albumCities export not found or not an array');
	}

	const pending = cities.filter(needsCoords);
	if (pending.length === 0) {
		console.log('All cities already have coordinates — nothing to do.');
		return;
	}

	console.log(`Geocoding ${pending.length} city/cities...\n`);

	// 2 + 3. Query only cities missing coords; mutate the array in place.
	const updated = [];
	const failed = [];
	for (const city of pending) {
		try {
			const coords = await geocode(city);
			if (coords) {
				city.lat = coords.lat;
				city.lon = coords.lon;
				updated.push(city);
				console.log(`  ✓ ${city.name} → lat ${coords.lat}, lon ${coords.lon}`);
			} else {
				failed.push(city.name);
				console.log(`  ✗ ${city.name} → no results`);
			}
		} catch (err) {
			failed.push(city.name);
			console.log(`  ✗ ${city.name} → ${err.message}`);
		}
		// Respect Nominatim's usage policy: max ~1 request/second.
		await sleep(1100);
	}

	// 4. Cities that already had coords were never touched.
	// Write the file back only if something actually changed.
	if (updated.length > 0) {
		const contents = `export const albumCities = ${serialize(cities)};\n`;
		await writeFile(DATA_PATH, contents, 'utf8');
	}

	// 5. Summary.
	console.log('\n── Done ──────────────────────────');
	console.log(`Updated: ${updated.length ? updated.map((c) => c.name).join(', ') : '(none)'}`);
	if (failed.length) console.log(`Failed:  ${failed.join(', ')}`);
}

main().catch((err) => {
	console.error('Error:', err.message);
	process.exit(1);
});
