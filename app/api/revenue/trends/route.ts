import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getMonth, getYear } from 'date-fns';

// GET /api/revenue/trends - Fetch monthly revenue and expense trends
export async function GET() {
  try {
    const revenues = await prisma.revenue.findMany({
      orderBy: { date: 'asc' },
    });

    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'asc' },
    });

    const monthlyData: { [key: string]: { month: string; revenue: number; expenses: number } } = {};

    // Process revenues
    for (const revenue of revenues) {
      const year = getYear(revenue.date);
      const month = getMonth(revenue.date) + 1; // getMonth is 0-indexed
      const key = `${year}-${month.toString().padStart(2, '0')}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, revenue: 0, expenses: 0 };
      }
      monthlyData[key].revenue += revenue.amount;
    }

    // Process expenses
    for (const expense of expenses) {
        const year = getYear(expense.date);
        const month = getMonth(expense.date) + 1;
        const key = `${year}-${month.toString().padStart(2, '0')}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { month: key, revenue: 0, expenses: 0 };
        }
        monthlyData[key].expenses += expense.amount;
    }

    const trends = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    return NextResponse.json({ message: 'Error fetching revenue trends' }, { status: 500 });
  }
}
