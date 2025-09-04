import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/scripts/:id - Fetch a single script by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const script = await prisma.script.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    if (!script) {
      return NextResponse.json({ message: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error(`Error fetching script ${id}:`, error);
    return NextResponse.json({ message: `Error fetching script ${id}` }, { status: 500 });
  }
}

// PUT /api/scripts/:id - Update a script's title
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const updatedScript = await prisma.script.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updatedScript);
  } catch (error) {
    console.error(`Error updating script ${id}:`, error);
    return NextResponse.json({ message: `Error updating script ${id}` }, { status: 500 });
  }
}

// DELETE /api/scripts/:id - Delete a script
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Prisma cascading delete will handle removing related ScriptVersions
    await prisma.script.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting script ${id}:`, error);
    return NextResponse.json({ message: `Error deleting script ${id}` }, { status: 500 });
  }
}
