import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TaskStatus, Priority } from '@prisma/client';
import { subDays } from 'date-fns';

// GET /api/performance/productivity - Fetches productivity scores for all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const productivity = await Promise.all(
      users.map(async (user) => {
        const completedTasks = await prisma.task.findMany({
          where: {
            assigneeId: user.id,
            status: TaskStatus.COMPLETED,
            updatedAt: { // Assuming updatedAt is a good proxy for completion date
              gte: subDays(new Date(), 30),
            },
          },
          select: {
            priority: true,
          }
        });

        // Calculate a weighted score
        let score = 0;
        for (const task of completedTasks) {
            switch (task.priority) {
                case Priority.URGENT:
                    score += 4;
                    break;
                case Priority.HIGH:
                    score += 3;
                    break;
                case Priority.MEDIUM:
                    score += 2;
                    break;
                case Priority.LOW:
                    score += 1;
                    break;
            }
        }

        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          tasksCompletedLast30Days: completedTasks.length,
          productivityScore: score,
        };
      })
    );

    const sortedProductivity = productivity.sort((a, b) => b.productivityScore - a.productivityScore);

    return NextResponse.json(sortedProductivity);
  } catch (error) {
    console.error('Error fetching team productivity:', error);
    return NextResponse.json({ message: 'Error fetching team productivity' }, { status: 500 });
  }
}
