import { NextResponse } from 'next/server'
import { PrismaClient } from "../../../../node_modules/.prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        location: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phoneNumber, location, disasterUpdates } = body;

    const [lat, lon] = location.loc?.split(',').map(Number) || [null, null];

    const user = await prisma.user.update({
      where: { email },
      data: {
        name,
        phoneNumber,
        disasterUpdates,
        location: {
          upsert: {
            create: {
              city: location.city,
              region: location.region,
              country: location.country,
              latitude: lat,
              longitude: lon,
              ip: location.ip,
            },
            update: {
              city: location.city,
              region: location.region,
              country: location.country,
              latitude: lat,
              longitude: lon,
              ip: location.ip,
            },
          },
        },
      },
      include: {
        location: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
