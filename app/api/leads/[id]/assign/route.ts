import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/leads/:id/assign - Assign a lead to a user
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { assigneeId: userId },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(`Error assigning lead ${id}:`, error);
    return NextResponse.json({ message: `Error assigning lead` }, { status: 500 });
  }
}
