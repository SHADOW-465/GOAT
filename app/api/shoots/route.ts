import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ShootStatus } from '@prisma/client';

// GET /api/shoots - Fetch all shoots
export async function GET() {
  try {
    const shoots = await prisma.shoot.findMany({
      include: {
        client: true,
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(shoots);
  } catch (error) {
    console.error('Error fetching shoots:', error);
    return NextResponse.json({ message: 'Error fetching shoots' }, { status: 500 });
  }
}

// POST /api/shoots - Create a new shoot
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, startTime, endTime, location, status, clientId } = data;

    if (!title || !startTime || !endTime) {
      return NextResponse.json({ message: 'Title, startTime, and endTime are required' }, { status: 400 });
    }

    const newShoot = await prisma.shoot.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        status: status as ShootStatus,
        clientId,
      },
    });

    return NextResponse.json(newShoot, { status: 201 });
  } catch (error) {
    console.error('Error creating shoot:', error);
    return NextResponse.json({ message: 'Error creating shoot' }, { status: 500 });
  }
}
