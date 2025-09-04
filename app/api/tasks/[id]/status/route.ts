import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

// PUT /api/tasks/:id/status - Update a task's status
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { status } = await request.json();

    if (!status || !Object.values(TaskStatus).includes(status)) {
      return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating status for task ${id}:`, error);
    return NextResponse.json({ message: `Error updating task status` }, { status: 500 });
  }
}
