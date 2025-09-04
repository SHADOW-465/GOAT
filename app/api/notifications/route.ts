import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NotificationCategory } from '@prisma/client';

// GET /api/notifications - Fetch all notifications (could be filtered by userId in a real app)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId ? String(userId) : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit the number of notifications returned
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { message, category, userId } = data;

    if (!message || !category || !userId) {
      return NextResponse.json({ message: 'Message, category, and userId are required' }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        message,
        category: category as NotificationCategory,
        userId,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ message: 'Error creating notification' }, { status: 500 });
  }
}
