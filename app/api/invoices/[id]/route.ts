import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InvoiceStatus } from '@prisma/client';

// GET /api/invoices/:id - Fetch a single invoice
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true, revenue: true },
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    return NextResponse.json({ message: `Error fetching invoice` }, { status: 500 });
  }
}

// PUT /api/invoices/:id - Update an invoice
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { amount, status, dueDate, clientId } = data;

    // When updating status to PAID, create a revenue entry if it doesn't exist
    if (status === InvoiceStatus.PAID) {
        const existingRevenue = await prisma.revenue.findUnique({ where: { invoiceId: id } });
        if (!existingRevenue) {
            const invoice = await prisma.invoice.findUnique({ where: { id } });
            if (invoice) {
                await prisma.revenue.create({
                    data: {
                        amount: invoice.amount,
                        date: new Date(),
                        invoiceId: id,
                    }
                });
            }
        }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        amount,
        status: status as InvoiceStatus,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        clientId,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    return NextResponse.json({ message: `Error updating invoice` }, { status: 500 });
  }
}

// DELETE /api/invoices/:id - Delete an invoice
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Also delete the associated revenue entry if it exists
    await prisma.revenue.deleteMany({
        where: { invoiceId: id }
    });

    await prisma.invoice.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    return NextResponse.json({ message: `Error deleting invoice` }, { status: 500 });
  }
}
