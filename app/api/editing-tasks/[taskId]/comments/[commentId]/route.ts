import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/editing-tasks/:taskId/comments/:commentId - Delete a comment
export async function DELETE(request: Request, { params }: { params: { taskId: string, commentId: string } }) {
  const { commentId } = params;
  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    // It's good practice to check for specific Prisma errors, e.g., P2025 (Record to delete does not exist)
    return NextResponse.json({ message: `Error deleting comment` }, { status: 500 });
  }
}
