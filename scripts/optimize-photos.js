// Optimize photos under public/photos/ with sharp.
//
// For every original raster image (not a *_full backup, not an already-generated
// .webp), this script produces:
//   - {name}.webp        thumbnail   — width 800px,  quality 80
//   - {name}_full.webp   high-res    — width 2000px, quality 90
// and preserves the untouched original by renaming it to {name}_full.{ext}.
//
// Re-running is safe/idempotent: once a file becomes a *_full backup or a .webp
// output it is skipped, and images that already have both .webp outputs are
// skipped too.
//
// Usage:  node scripts/optimize-photos.js   (or: npm run optimize:photos)

import sharp from 'sharp';
import { readdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = path.resolve(__dirname, '..', 'public', 'photos');

const THUMB_WIDTH = 800;
const THUMB_QUALITY = 80;
const FULL_WIDTH = 2000;
const FULL_QUALITY = 90;

// Source raster formats we optimize. (.webp is treated as already-optimized output.)
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.avif']);

const stats = { processed: 0, skipped: 0, failed: 0 };

/** Recursively collect every file path under `dir`. */
async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walk(full)));
		} else if (entry.isFile()) {
			files.push(full);
		}
	}
	return files;
}

/** True for files we must never treat as a source original. */
function isSkippable(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	const base = path.basename(filePath, path.extname(filePath));
	if (ext === '.webp') return true; // generated output
	if (base.endsWith('_full')) return true; // preserved original backup
	if (!RASTER_EXT.has(ext)) return true; // not an image we handle
	return false;
}

async function optimize(filePath) {
	const dir = path.dirname(filePath);
	const ext = path.extname(filePath);
	const base = path.basename(filePath, ext);

	const thumbWebp = path.join(dir, `${base}.webp`);
	const fullWebp = path.join(dir, `${base}_full.webp`);
	const backup = path.join(dir, `${base}_full${ext}`);

	// Already fully optimized → nothing to do.
	if (existsSync(thumbWebp) && existsSync(fullWebp)) {
		stats.skipped++;
		return;
	}

	// Prefer the preserved backup as source if a previous run already renamed it.
	const source = existsSync(backup) ? backup : filePath;

	// Thumbnail (800px, q80). `withoutEnlargement` keeps small images at native size.
	await sharp(source)
		.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
		.webp({ quality: THUMB_QUALITY })
		.toFile(thumbWebp);

	// High-res (2000px, q90).
	await sharp(source)
		.resize({ width: FULL_WIDTH, withoutEnlargement: true })
		.webp({ quality: FULL_QUALITY })
		.toFile(fullWebp);

	// Preserve the original by renaming it to {name}_full.{ext} (skip if a backup exists).
	if (!existsSync(backup)) {
		await rename(filePath, backup);
	}

	stats.processed++;
	console.log(`✓ ${path.relative(PHOTOS_DIR, filePath)}`);
}

async function main() {
	if (!existsSync(PHOTOS_DIR)) {
		console.error(`photos directory not found: ${PHOTOS_DIR}`);
		process.exit(1);
	}

	const all = await walk(PHOTOS_DIR);
	const targets = all.filter((f) => !isSkippable(f));

	console.log(`Scanning ${PHOTOS_DIR}`);
	console.log(`${all.length} files found, ${targets.length} originals to optimize.\n`);

	for (const file of targets) {
		try {
			await optimize(file);
		} catch (err) {
			stats.failed++;
			console.error(`✗ ${path.relative(PHOTOS_DIR, file)} — ${err.message}`);
		}
	}

	console.log(
		`\nDone. processed: ${stats.processed}, skipped: ${stats.skipped}, failed: ${stats.failed}`,
	);
}

main();
