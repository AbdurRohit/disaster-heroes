import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const report = await prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        datetime: new Date(data.datetime),
        categories: data.categories,
        fullName: data.fullName || null,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        locationLandmark: data.locationLandmark,
        newsSourceLink: data.newsSourceLink || null,
        mediaUrls: data.mediaUrls || [],
        latitude: data.latitude,
        longitude: data.longitude,
        locationAddress: data.locationAddress,
        status: 'PENDING', // Default status for new reports
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}