import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/scripts/:id/versions - Create a new version for a script
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const scriptId = params.id;
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    // We need to fetch the latest version number to increment it.
    // This should ideally be done in a transaction to prevent race conditions.
    const latestVersion = await prisma.scriptVersion.findFirst({
      where: { scriptId },
      orderBy: { version: 'desc' },
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    const newVersion = await prisma.scriptVersion.create({
      data: {
        scriptId,
        content,
        version: newVersionNumber,
      },
    });

    // Also update the script's updatedAt timestamp
    await prisma.script.update({
        where: { id: scriptId },
        data: { updatedAt: new Date() }
    })

    return NextResponse.json(newVersion, { status: 201 });
  } catch (error) {
    console.error(`Error creating version for script ${scriptId}:`, error);
    return NextResponse.json({ message: `Error creating script version` }, { status: 500 });
  }
}
