import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TaskStatus, Priority } from '@prisma/client';

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, status, priority, dueDate, assigneeId, projectId } = data;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status as TaskStatus,
        priority: priority as Priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
        projectId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
  }
}
