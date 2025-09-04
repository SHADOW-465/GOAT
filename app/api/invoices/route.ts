import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InvoiceStatus } from '@prisma/client';

// GET /api/invoices - Fetch all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
      },
      orderBy: {
        dueDate: 'desc',
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ message: 'Error fetching invoices' }, { status: 500 });
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { amount, status, dueDate, clientId } = data;

    if (!amount || !dueDate || !clientId) {
      return NextResponse.json({ message: 'Amount, dueDate, and clientId are required' }, { status: 400 });
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        amount,
        status: status as InvoiceStatus,
        dueDate: new Date(dueDate),
        clientId,
      },
    });

    // If the invoice is created as PAID, also create a revenue entry
    if (newInvoice.status === InvoiceStatus.PAID) {
        await prisma.revenue.create({
            data: {
                amount: newInvoice.amount,
                date: new Date(),
                invoiceId: newInvoice.id,
            }
        });
    }

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ message: 'Error creating invoice' }, { status: 500 });
  }
}
