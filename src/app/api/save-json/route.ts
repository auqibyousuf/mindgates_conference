import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    const allowedFiles = ['siteConfig.json', 'conferences.json', 'books.json', 'awards.json', 'editors.json'];
    if (!filename || !allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const data = await readData(filename);
    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to read data', 
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { filename, data } = await request.json();
    
    const allowedFiles = ['siteConfig.json', 'conferences.json', 'books.json', 'awards.json', 'editors.json'];
    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const result = await writeData(filename, data);
    
    if (result.success) {
      return NextResponse.json({ success: true, storage: result.storage });
    } else {
      return NextResponse.json({ error: result.error, cwd: result.cwd }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to save data', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
