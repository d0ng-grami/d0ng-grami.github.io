// src/admin/api/photos.js — upload / delete photos for a city+year
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { readCities, writeCities, json, slug } from '../../lib/cities-store.js';

export const prerender = false;

const PUBLIC_DIR = resolve(process.cwd(), 'public');

// Keep a filesystem-safe filename (strip path bits, allow word chars/.-).
function safeName(name) {
	return String(name).split(/[\\/]/).pop().replace(/[^\w.\-]+/g, '_');
}

// POST → upload (multipart/form-data: file, city, year)
export async function POST({ request }) {
	const form = await request.formData();
	const file = form.get('file');
	const city = (form.get('city') || '').toString().trim();
	const year = (form.get('year') || '').toString().trim();

	if (!file || typeof file === 'string') return json({ error: 'file is required' }, 400);
	if (!city || !year) return json({ error: 'city and year are required' }, 400);

	const cities = await readCities();
	const cityObj = cities.find((c) => c.name === city);
	if (!cityObj) return json({ error: `city "${city}" not found` }, 404);

	// Save the file under public/photos/{slug}/{year}/
	const citySlug = slug(city);
	const dir = resolve(PUBLIC_DIR, 'photos', citySlug, year);
	await mkdir(dir, { recursive: true });

	const filename = safeName(file.name);
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(join(dir, filename), buffer);

	const src = `/photos/${citySlug}/${year}/${filename}`;

	// Update album-cities.js: ensure the year exists, then add the photo.
	let yearObj = cityObj.years.find((y) => y.year === year);
	if (!yearObj) {
		yearObj = { year, photos: [] };
		cityObj.years.push(yearObj);
	}
	if (!yearObj.photos) yearObj.photos = [];
	if (!yearObj.photos.some((p) => p.src === src)) {
		yearObj.photos.push({ src, full: src });
	}

	await writeCities(cities);
	return json({ ok: true, src, cities });
}

// DELETE → remove a photo  { city, year, src }
export async function DELETE({ request }) {
	let body;
	try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }

	const { city, year, src } = body;
	if (!city || !year || !src) return json({ error: 'city, year, src are required' }, 400);

	// Remove the file (only within public/, guard against path escape).
	const rel = String(src).replace(/^\/+/, '');
	const filePath = resolve(PUBLIC_DIR, rel);
	if (filePath.startsWith(PUBLIC_DIR)) {
		await rm(filePath, { force: true });
	}

	// Update data
	const cities = await readCities();
	const cityObj = cities.find((c) => c.name === city);
	const yearObj = cityObj?.years.find((y) => y.year === year);
	if (yearObj?.photos) {
		yearObj.photos = yearObj.photos.filter((p) => p.src !== src);
	}
	await writeCities(cities);

	return json({ ok: true, cities });
}
