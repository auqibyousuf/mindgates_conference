import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    const allowedFiles = ['siteConfig.json', 'conferences.json', 'books.json', 'awards.json', 'editors.json'];
    if (!filename || !allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');

    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    const cwd = process.cwd();
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ 
      error: `Failed to read data: ${detail} (CWD: ${cwd})`
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { filename, data } = await request.json();
    
    // Safety check: only allow specific JSON files
    const allowedFiles = ['siteConfig.json', 'conferences.json', 'books.json', 'awards.json', 'editors.json'];
    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ 
      error: 'Failed to save data', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
