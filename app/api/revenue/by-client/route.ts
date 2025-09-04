import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/revenue/by-client - Fetch revenue grouped by client
export async function GET() {
  try {
    const revenueByClient = await prisma.invoice.groupBy({
      by: ['clientId'],
      _sum: {
        amount: true,
      },
      where: {
        status: 'PAID',
      },
    });

    // The result gives clientId, we need to fetch client names for a better response
    const clientIds = revenueByClient.map((r) => r.clientId);
    const clients = await prisma.client.findMany({
      where: {
        id: { in: clientIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const clientMap = new Map(clients.map((c) => [c.id, c.name]));

    const result = revenueByClient.map((r) => ({
      clientId: r.clientId,
      clientName: clientMap.get(r.clientId) || 'Unknown Client',
      totalRevenue: r._sum.amount,
    })).sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching revenue by client:', error);
    return NextResponse.json({ message: 'Error fetching revenue by client' }, { status: 500 });
  }
}
