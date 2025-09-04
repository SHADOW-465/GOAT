import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EditingStatus } from '@prisma/client';

// GET /api/editing-tasks - Fetch all editing tasks
export async function GET() {
  try {
    const editingTasks = await prisma.editingTask.findMany({
      include: {
        feedback: true, // Include comments
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(editingTasks);
  } catch (error) {
    console.error('Error fetching editing tasks:', error);
    return NextResponse.json({ message: 'Error fetching editing tasks' }, { status: 500 });
  }
}

// POST /api/editing-tasks - Create a new editing task
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, status, files } = data;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const newEditingTask = await prisma.editingTask.create({
      data: {
        title,
        description,
        status: status as EditingStatus,
        // The files field expects a single string. If the client sends an array, we should stringify it.
        files: Array.isArray(files) ? JSON.stringify(files) : files || '[]',
      },
    });

    return NextResponse.json(newEditingTask, { status: 201 });
  } catch (error) {
    console.error('Error creating editing task:', error);
    return NextResponse.json({ message: 'Error creating editing task' }, { status: 500 });
  }
}
