import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

// GET /api/leads - Fetch all leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ message: 'Error fetching leads' }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, status, assigneeId } = data;

    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status: status as LeadStatus,
        assigneeId,
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ message: 'Error creating lead' }, { status: 500 });
  }
}
