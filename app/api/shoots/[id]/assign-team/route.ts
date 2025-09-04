import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/shoots/:id/assign-team - Assign a user to a shoot
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const shootId = params.id;
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ message: 'userId and role are required' }, { status: 400 });
    }

    // Check if the assignment already exists to prevent duplicates
    const existingAssignment = await prisma.shootAssignment.findUnique({
      where: {
        shootId_userId: {
          shootId,
          userId,
        },
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { message: 'User is already assigned to this shoot' },
        { status: 409 } // Conflict
      );
    }

    const newAssignment = await prisma.shootAssignment.create({
      data: {
        shootId,
        userId,
        role,
      },
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error(`Error assigning team for shoot ${shootId}:`, error);
    return NextResponse.json({ message: 'Error assigning team' }, { status: 500 });
  }
}
