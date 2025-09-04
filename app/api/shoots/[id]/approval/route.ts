import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ShootStatus } from '@prisma/client';

// PUT /api/shoots/:id/approval - Approve or reject a shoot
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { status } = await request.json();

    if (status !== ShootStatus.APPROVED && status !== ShootStatus.REJECTED) {
      return NextResponse.json(
        { message: 'Invalid status. Must be APPROVED or REJECTED.' },
        { status: 400 }
      );
    }

    const updatedShoot = await prisma.shoot.update({
      where: { id },
      data: { status },
    });

    // Optional: Create a notification for the user who created the shoot
    // This would require adding a `creatorId` to the Shoot model.
    // For now, this action just changes the status.

    return NextResponse.json(updatedShoot);
  } catch (error) {
    console.error(`Error updating shoot approval for ${id}:`, error);
    return NextResponse.json({ message: 'Error updating shoot approval' }, { status: 500 });
  }
}
