import fs from 'fs';
import path from 'path';

/**
 * Robust data handler that works both locally (Filesystem) 
 * and on Cloudflare (KV Storage).
 */
export async function readData(filename: string) {
  // 1. Try Cloudflare KV first
  try {
    // @ts-ignore: Dynamic import to avoid build issues in non-cf envs
    const { getRequestContext } = await import('@opennextjs/cloudflare');
    const { env } = getRequestContext();
    const kv = env.MINDGATES_DATA;
    
    if (kv) {
      const data = await kv.get(filename);
      if (data) return JSON.parse(data);
    }
  } catch {
    // Fallback to filesystem if not in CF or KV not bound
  }

  // 2. Fallback to Local Filesystem
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Read error for ${filename}:`, err);
  }

  return null;
}

export async function writeData(filename: string, data: any) {
  // 1. Try Cloudflare KV first
  try {
    // @ts-ignore
    const { getRequestContext } = await import('@opennextjs/cloudflare');
    const { env } = getRequestContext();
    const kv = env.MINDGATES_DATA;
    
    if (kv) {
      await kv.put(filename, JSON.stringify(data));
      return { success: true, storage: 'kv' };
    }
  } catch {
    // Fallback to filesystem
  }

  // 2. Fallback to Local Filesystem
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true, storage: 'fs' };
  } catch (err) {
    console.error(`Write error for ${filename}:`, err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : String(err),
      cwd: process.cwd()
    };
  }
}
