import siteConfigDefault from '@/data/siteConfig.json';
import conferencesDefault from '@/data/conferences.json';
import booksDefault from '@/data/books.json';
import awardsDefault from '@/data/awards.json';
import editorsDefault from '@/data/editors.json';

/**
 * Robust data handler that works both locally (Filesystem) 
 * and on Cloudflare (KV Storage).
 */

// Use dynamic detection for Cloudflare context
let getKV: (() => { env: Record<string, any> }) | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

async function initCloudflare() {
  if (getKV) return;
  try {
    // @ts-expect-error - This module only exists in Cloudflare runtime
    const cf = await import('@opennextjs/cloudflare');
    getKV = cf.getCloudflareContext;
  } catch {
    // Not in Cloudflare environment
  }
}

const DEFAULT_DATA: Record<string, unknown> = {
  'siteConfig.json': siteConfigDefault,
  'conferences.json': conferencesDefault,
  'books.json': booksDefault,
  'awards.json': awardsDefault,
  'editors.json': editorsDefault,
};

export async function readData(filename: string): Promise<unknown> {
  try {
    await initCloudflare();
    
    // 1. Try Cloudflare KV first (Production)
    if (getKV) {
      const ctx = getKV();
      const kv = ctx?.env?.MINDGATES_DATA;
      if (kv) {
        const data = await kv.get(filename);
        if (data) return JSON.parse(data);
      }
    }

    // 2. Fallback to Local Filesystem (Development)
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'src/data', filename);
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      } catch {
        // Fallback to static data if fs fails
      }
    }

    // 3. Final Fallback: Hardcoded defaults (Production first-load)
    return DEFAULT_DATA[filename] || null;

  } catch (error) {
    console.error(`Error reading data (${filename}):`, error);
    return DEFAULT_DATA[filename] || null;
  }
}

export async function writeData(filename: string, data: unknown) {
  try {
    await initCloudflare();

    // 1. Try Cloudflare KV first (Production)
    if (getKV) {
      const ctx = getKV();
      const kv = ctx?.env?.MINDGATES_DATA;
      if (kv) {
        await kv.put(filename, JSON.stringify(data));
        return { success: true, storage: 'kv' };
      }
    }

    // 2. Fallback to Local Filesystem (Development)
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src/data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true, storage: 'fs' };

  } catch (error) {
    console.error(`Error writing data (${filename}):`, error);
    return { success: false, error: String(error) };
  }
}
