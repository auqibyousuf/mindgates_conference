import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let getKV: (() => { env: Record<string, any> }) | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

async function initCloudflare() {
  if (getKV) return;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cf = await import('@opennextjs/cloudflare');
    getKV = cf.getCloudflareContext;
  } catch {
    // Not in Cloudflare environment
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
    }

    await initCloudflare();

    // 1. Try KV storage
    if (getKV) {
      try {
        const ctx = getKV();
        const kv = ctx?.env?.MINDGATES_DATA;
        if (kv) {
          const raw = await kv.get(`file:${fileId}`);
          if (raw) {
            const data = JSON.parse(raw);
            const buffer = Buffer.from(data.base64, 'base64');
            return new Response(buffer, {
              status: 200,
              headers: {
                'Content-Type': data.mimeType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        }
      } catch (err) {
        console.error('Error fetching file from KV:', err);
      }
    }

    // 2. Try Local FS fallback (if run locally)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileId);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new Response(fileBuffer, {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch {
      // Ignored
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
