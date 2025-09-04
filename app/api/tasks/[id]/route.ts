import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TaskStatus, Priority } from '@prisma/client';

// GET /api/tasks/:id - Fetch a single task by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: true,
        timeLogs: true,
      },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return NextResponse.json({ message: `Error fetching task ${id}` }, { status: 500 });
  }
}

// PUT /api/tasks/:id - Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { title, description, status, priority, dueDate, assigneeId, projectId } = data;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status: status as TaskStatus,
        priority: priority as Priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
        projectId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    return NextResponse.json({ message: `Error updating task ${id}` }, { status: 500 });
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Before deleting a task, we need to delete related records in TimeLog
    await prisma.timeLog.deleteMany({
      where: { taskId: id },
    });

    await prisma.task.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    return NextResponse.json({ message: `Error deleting task ${id}` }, { status: 500 });
  }
}
