import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/textures/
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const path = join(process.cwd(), 'public', 'textures', filename);

    // Ensure the directory exists (optional, but assume public/textures exists or will be created)
    // For simplicity, we just write it. If textures doesn't exist, this will throw.
    await writeFile(path, buffer);

    return NextResponse.json({ url: `/textures/${filename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
