import siteConfigDefault from '@/data/siteConfig.json';
import conferencesDefault from '@/data/conferences.json';
import booksDefault from '@/data/books.json';
import awardsDefault from '@/data/awards.json';
import editorsDefault from '@/data/editors.json';
import notificationsDefault from '@/data/notifications.json';
import statsDefault from '@/data/stats.json';

/**
 * Robust data handler that works both locally (Filesystem) 
 * and on Cloudflare (KV Storage).
 */

// Use dynamic detection for Cloudflare context
let getKV: (() => { env: Record<string, any> }) | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

async function initCloudflare() {
  if (getKV) return;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - This module only exists in Cloudflare runtime
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
  'notifications.json': notificationsDefault,
  'stats.json': statsDefault,
};

export async function readData(filename: string): Promise<unknown> {
  try {
    await initCloudflare();
    
    let resultData: unknown = null;
    
    // 1. Try Cloudflare KV first (Production)
    if (getKV) {
      try {
        const ctx = getKV();
        const kv = ctx?.env?.MINDGATES_DATA;
        if (kv) {
          const data = await kv.get(filename);
          if (data) resultData = JSON.parse(data);
        }
      } catch {
        // Expected to fail during build/static generation
      }
    }

    // 2. Fallback to Local Filesystem if available (Local environments)
    if (!resultData) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'src/data', filename);
        if (fs.existsSync(filePath)) {
          resultData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      } catch {
        // Fallback to static data if fs fails (e.g. Cloudflare Worker environment)
      }
    }

    // 3. Final Fallback: Hardcoded defaults (Production first-load)
    if (!resultData) {
      resultData = DEFAULT_DATA[filename] || null;
    }

    // Force sync ADMIN_EMAIL/SMTP_USER from environment variables into siteConfig.json
    if (filename === 'siteConfig.json' && resultData && typeof resultData === 'object') {
      const envEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (envEmail) {
        const config = resultData as Record<string, any>;
        if (!config.contact) {
          config.contact = {};
        }
        config.contact.email = envEmail;
      }
    }

    return resultData;

  } catch (error) {
    console.error(`Error reading data (${filename}):`, error);
    let fallbackData = DEFAULT_DATA[filename] || null;
    if (filename === 'siteConfig.json' && fallbackData && typeof fallbackData === 'object') {
      const envEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (envEmail) {
        const config = JSON.parse(JSON.stringify(fallbackData)) as Record<string, any>;
        if (!config.contact) {
          config.contact = {};
        }
        config.contact.email = envEmail;
        fallbackData = config;
      }
    }
    return fallbackData;
  }
}

export async function writeData(filename: string, data: unknown) {
  let storage = 'default';
  try {
    await initCloudflare();

    // Force sync ADMIN_EMAIL/SMTP_USER from environment variables into siteConfig.json when writing
    if (filename === 'siteConfig.json' && data && typeof data === 'object') {
      const envEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (envEmail) {
        const config = data as Record<string, any>;
        if (!config.contact) {
          config.contact = {};
        }
        config.contact.email = envEmail;
      }
    }

    // 1. Try Cloudflare KV (Production/Local wrangler emulation)
    let kvSaved = false;
    if (getKV) {
      try {
        const ctx = getKV();
        const kv = ctx?.env?.MINDGATES_DATA;
        if (kv) {
          await kv.put(filename, JSON.stringify(data));
          storage = 'kv';
          kvSaved = true;
        }
      } catch {
        // Safe to ignore
      }
    }

    // 2. Also write to Local Filesystem if available (so local edits sync to disk)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src/data', filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      if (!kvSaved) {
        storage = 'fs';
      }
    } catch {
      // Ignored in Cloudflare production environment where fs is not writeable
    }

    return { success: true, storage };

  } catch (error) {
    console.error(`Error writing data (${filename}):`, error);
    return { success: false, error: String(error) };
  }
}
