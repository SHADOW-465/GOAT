import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

// GET /api/leads/:id - Fetch a single lead by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error(`Error fetching lead ${id}:`, error);
    return NextResponse.json({ message: `Error fetching lead ${id}` }, { status: 500 });
  }
}

// PUT /api/leads/:id - Update a lead
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { name, email, phone, status, assigneeId, rejectionReason } = data;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        status: status as LeadStatus,
        assigneeId,
        rejectionReason,
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead ${id}:`, error);
    return NextResponse.json({ message: `Error updating lead ${id}` }, { status: 500 });
  }
}

// DELETE /api/leads/:id - Delete a lead
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.lead.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting lead ${id}:`, error);
    return NextResponse.json({ message: `Error deleting lead ${id}` }, { status: 500 });
  }
}
