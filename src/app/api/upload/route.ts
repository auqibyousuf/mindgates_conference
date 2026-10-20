import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let getKV: (() => { env: Record<string, any> }) | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

async function initCloudflare() {
  if (getKV) return;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Module only exists in Cloudflare OpenNext runtime
    const cf = await import('@opennextjs/cloudflare');
    getKV = cf.getCloudflareContext;
  } catch {
    // Not running on Cloudflare OpenNext runtime
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'application/octet-stream';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileId = `${Date.now()}-${cleanFileName}`;

    // 1. If on Cloudflare with KV namespace, save file in KV
    await initCloudflare();
    let savedInKV = false;
    if (getKV) {
      try {
        const ctx = getKV();
        const kv = ctx?.env?.MINDGATES_DATA;
        if (kv) {
          const base64Data = buffer.toString('base64');
          const payload = JSON.stringify({
            mimeType,
            base64: base64Data,
            name: file.name,
            uploadedAt: Date.now(),
          });
          // KV key format: "file:<fileId>"
          await kv.put(`file:${fileId}`, payload);
          savedInKV = true;
        }
      } catch (kvErr) {
        console.warn('Could not save file to KV:', kvErr);
      }
    }

    // 2. Try writing to local filesystem (development/Node environment)
    let savedInFs = false;
    try {
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileId);
      fs.writeFileSync(filePath, buffer);
      savedInFs = true;
    } catch {
      // Ignored if read-only filesystem (Cloudflare worker edge)
    }

    // 3. Determine the public URL
    // If saved to KV, it can be served via /api/upload/file/[fileId]
    // If saved to FS, it can also be accessed via /uploads/[fileId]
    let publicUrl = '';
    if (savedInFs && !savedInKV) {
      publicUrl = `/uploads/${fileId}`;
    } else if (savedInKV) {
      publicUrl = `/api/upload/file/${fileId}`;
    } else {
      // Fallback: If neither KV nor FS is available, or for inline small images, use base64 data URI
      publicUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }
    
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
