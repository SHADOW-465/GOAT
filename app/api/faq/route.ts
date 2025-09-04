import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/faq - Fetch all FAQ entries
export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ message: 'Error fetching FAQs' }, { status: 500 });
  }
}
