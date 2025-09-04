import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/editing-tasks/:id/comments - Fetch all comments for a task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const editingTaskId = params.id;
  try {
    const comments = await prisma.comment.findMany({
      where: { editingTaskId },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(`Error fetching comments for task ${editingTaskId}:`, error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}

// POST /api/editing-tasks/:id/comments - Add a comment to a task
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const editingTaskId = params.id;
  try {
    const data = await request.json();
    const { content, timestamp } = data;

    if (!content || timestamp === undefined) {
      return NextResponse.json({ message: 'Content and timestamp are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        timestamp,
        editingTaskId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(`Error creating comment for task ${editingTaskId}:`, error);
    return NextResponse.json({ message: 'Error creating comment' }, { status: 500 });
  }
}
