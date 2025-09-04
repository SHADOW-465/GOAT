import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

// PUT /api/leads/:id/status - Update a lead's status
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { status, rejectionReason } = await request.json();

    if (!status || !Object.values(LeadStatus).includes(status)) {
      return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
    }

    if (status === LeadStatus.REJECTED && !rejectionReason) {
        return NextResponse.json({ message: 'Rejection reason is required when rejecting a lead' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
          status,
          rejectionReason: status === LeadStatus.REJECTED ? rejectionReason : null,
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(`Error updating status for lead ${id}:`, error);
    return NextResponse.json({ message: 'Error updating lead status' }, { status: 500 });
  }
}
