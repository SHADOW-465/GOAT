import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ShootStatus } from '@prisma/client';

// GET /api/shoots/:id - Fetch a single shoot by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const shoot = await prisma.shoot.findUnique({
      where: { id },
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
    });

    if (!shoot) {
      return NextResponse.json({ message: 'Shoot not found' }, { status: 404 });
    }

    return NextResponse.json(shoot);
  } catch (error) {
    console.error(`Error fetching shoot ${id}:`, error);
    return NextResponse.json({ message: `Error fetching shoot ${id}` }, { status: 500 });
  }
}

// PUT /api/shoots/:id - Update a shoot
export async function PUT(request: Request, { params }: { params: { id:string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { title, description, startTime, endTime, location, status, clientId } = data;

    const updatedShoot = await prisma.shoot.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        location,
        status: status as ShootStatus,
        clientId,
      },
    });

    return NextResponse.json(updatedShoot);
  } catch (error) {
    console.error(`Error updating shoot ${id}:`, error);
    return NextResponse.json({ message: `Error updating shoot ${id}` }, { status: 500 });
  }
}

// DELETE /api/shoots/:id - Delete a shoot
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Prisma cascading delete will handle removing related ShootAssignments
    await prisma.shoot.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting shoot ${id}:`, error);
    return NextResponse.json({ message: `Error deleting shoot ${id}` }, { status: 500 });
  }
}
