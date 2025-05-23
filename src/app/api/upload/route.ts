import { NextResponse } from 'next/server';
import { bucket } from '@/lib/firebaseAdmin';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `uploads/${randomUUID()}-${file.name}`;
  const fileUpload = bucket.file(filename);

  await fileUpload.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    public: true, // Optional: make public
  });

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  return NextResponse.json({ url: publicUrl });
}   