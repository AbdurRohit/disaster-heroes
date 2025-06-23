import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/lib/firebase';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();
const uploadDir = join(process.cwd(), 'tmp');

export async function POST(request: Request) {
  try {
    await mkdir(uploadDir, { recursive: true });
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, message: 'Only image and video files are allowed' },
        { status: 400 }
      );
    }

    // Create temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(uploadDir, file.name);
    await writeFile(tempPath, buffer);

    try {
      // Upload to Firebase
      const timestamp = Date.now();
      const filename = `uploads/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save to database
      const media = await prisma.media.create({
        data: {
          url: downloadURL,
        },
      });

      // Clean up temp file
      await unlink(tempPath).catch(console.error);

      return NextResponse.json({ 
        success: true,
        message: 'File uploaded successfully',
        url: downloadURL,
        mediaId: media.id
      });

    } catch (uploadError) {
      console.error('Firebase upload error:', uploadError);
      await unlink(tempPath).catch(console.error);
      return NextResponse.json(
        { success: false, message: 'Failed to upload to storage' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  api: { bodyParser: false }
};

