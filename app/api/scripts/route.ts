import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/scripts - Fetch all scripts
export async function GET() {
  try {
    const scripts = await prisma.script.findMany({
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json({ message: 'Error fetching scripts' }, { status: 500 });
  }
}

// POST /api/scripts - Create a new script
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, initialContent } = data;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const newScript = await prisma.script.create({
      data: {
        title,
        versions: {
          create: {
            content: initialContent || 'Initial version.',
            version: 1,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    return NextResponse.json(newScript, { status: 201 });
  } catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json({ message: 'Error creating script' }, { status: 500 });
  }
}
