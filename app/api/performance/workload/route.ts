import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

// GET /api/performance/workload - Fetches current task workload for all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const workload = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await prisma.task.count({
          where: {
            assigneeId: user.id,
            status: TaskStatus.PENDING,
          },
        });
        const inProgressTasks = await prisma.task.count({
          where: {
            assigneeId: user.id,
            status: TaskStatus.IN_PROGRESS,
          },
        });

        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          openTasks: pendingTasks + inProgressTasks,
          pendingTasks,
          inProgressTasks,
        };
      })
    );

    const sortedWorkload = workload.sort((a, b) => b.openTasks - a.openTasks);

    return NextResponse.json(sortedWorkload);
  } catch (error) {
    console.error('Error fetching team workload:', error);
    return NextResponse.json({ message: 'Error fetching team workload' }, { status: 500 });
  }
}
