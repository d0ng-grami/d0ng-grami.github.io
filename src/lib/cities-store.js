// src/lib/cities-store.js
//
// Server-only helpers for reading/writing src/data/album-cities.js from the
// admin API endpoints. Runs under `astro dev` (SSR), where process.cwd() is
// the project root.

import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const DATA_PATH = resolve(process.cwd(), 'src/data/album-cities.js');

// Read the current albumCities array. Uses a cache-busting query so each call
// reflects the latest file contents (the module would otherwise be cached).
export async function readCities() {
	const url = pathToFileURL(DATA_PATH).href + `?t=${Date.now()}`;
	const mod = await import(/* @vite-ignore */ url);
	return Array.isArray(mod.albumCities) ? mod.albumCities : [];
}

// Serialize + write the array back as a JS module literal (unquoted keys,
// tab indent) so the file stays readable and importable by album.astro.
export async function writeCities(cities) {
	const contents = `export const albumCities = ${serialize(cities)};\n`;
	await writeFile(DATA_PATH, contents, 'utf8');
}

export function serialize(value, indent = 0) {
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

// "New York" -> "new-york" (folder/url-safe, matches the lowercase /photos/ convention).
export function slug(name) {
	return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Small JSON Response helper for endpoints.
export function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
