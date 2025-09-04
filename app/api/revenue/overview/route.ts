import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InvoiceStatus } from '@prisma/client';
import { subDays } from 'date-fns';

// GET /api/revenue/overview - Fetch financial overview metrics
export async function GET() {
  try {
    const totalRevenue = await prisma.revenue.aggregate({
      _sum: { amount: true },
    });

    const totalExpenses = await prisma.expense.aggregate({
        _sum: { amount: true },
    });

    const unpaidInvoices = await prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: InvoiceStatus.UNPAID },
    });

    const overdueInvoices = await prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: InvoiceStatus.OVERDUE },
    });

    const newLeadsCount = await prisma.lead.count({
        where: { createdAt: { gte: subDays(new Date(), 30) } }
    });

    const overview = {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      totalExpenses: totalExpenses._sum.amount ?? 0,
      netProfit: (totalRevenue._sum.amount ?? 0) - (totalExpenses._sum.amount ?? 0),
      unpaidAmount: unpaidInvoices._sum.amount ?? 0,
      overdueAmount: overdueInvoices._sum.amount ?? 0,
      newLeadsLast30Days: newLeadsCount,
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json({ message: 'Error fetching revenue overview' }, { status: 500 });
  }
}
