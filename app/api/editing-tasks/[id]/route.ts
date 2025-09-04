import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EditingStatus } from '@prisma/client';

// GET /api/editing-tasks/:id - Fetch a single editing task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const editingTask = await prisma.editingTask.findUnique({
      where: { id },
      include: {
        feedback: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!editingTask) {
      return NextResponse.json({ message: 'Editing task not found' }, { status: 404 });
    }

    return NextResponse.json(editingTask);
  } catch (error) {
    console.error(`Error fetching editing task ${id}:`, error);
    return NextResponse.json({ message: `Error fetching editing task` }, { status: 500 });
  }
}

// PUT /api/editing-tasks/:id - Update an editing task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { title, description, status, files } = data;

    const updatedEditingTask = await prisma.editingTask.update({
      where: { id },
      data: {
        title,
        description,
        status: status as EditingStatus,
        files: Array.isArray(files) ? JSON.stringify(files) : files,
      },
    });

    return NextResponse.json(updatedEditingTask);
  } catch (error) {
    console.error(`Error updating editing task ${id}:`, error);
    return NextResponse.json({ message: `Error updating editing task` }, { status: 500 });
  }
}

// DELETE /api/editing-tasks/:id - Delete an editing task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Prisma cascading delete will handle removing related Comments
    await prisma.editingTask.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting editing task ${id}:`, error);
    return NextResponse.json({ message: `Error deleting editing task` }, { status: 500 });
  }
}
