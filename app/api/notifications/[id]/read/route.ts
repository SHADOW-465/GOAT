import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/notifications/:id/read - Mark a notification as read
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { read } = await request.json();

    if (typeof read !== 'boolean') {
        return NextResponse.json({ message: 'A boolean "read" status is required' }, { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    return NextResponse.json({ message: 'Error updating notification' }, { status: 500 });
  }
}
