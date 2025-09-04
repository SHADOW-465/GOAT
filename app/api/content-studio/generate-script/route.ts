import { NextResponse } from 'next/server';

// POST /api/content-studio/generate-script - Mock AI script generator
export async function POST(request: Request) {
  try {
    const { topic, tone } = await request.json();

    if (!topic) {
      return NextResponse.json({ message: 'A topic is required to generate a script' }, { status: 400 });
    }

    // Simulate a delay to make the AI seem like it's "thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Pre-written mock script. In a real app, this would be an AI API call.
    const mockScript = `
**Title:** The Ultimate Guide to ${topic}

**Scene:** A bright, modern studio. An energetic host, JANE, stands by a digital whiteboard.

**(Intro Music Fades)**

**Jane:** Hey everyone, and welcome back to GOAT Media! Today, we're diving deep into something I know you've been asking about: **${topic}**. Whether you're a beginner or a seasoned pro, you're in the right place.

**(Scene: Close-up on Jane, with a friendly, ${tone || 'engaging'} tone)**

**Jane:** First things first, let's break down what ${topic} really means. It's not just a buzzword; it's a powerful strategy that can transform your brand. We'll cover the three key pillars...

**(Scene: Graphics appear on the whiteboard next to Jane)**

**Jane:** ...strategy, execution, and analysis. Get these right, and you're golden. Stick around, because by the end of this video, you'll have a clear, actionable plan.

**(Outro Music Begins)**

**Jane:** That's all for today! Don't forget to like, subscribe, and hit that notification bell so you don't miss our next video. Stay creative!
`;

    return NextResponse.json({ generatedScript: mockScript });

  } catch (error) {
    console.error('Error generating mock script:', error);
    return NextResponse.json({ message: 'Error generating mock script' }, { status: 500 });
  }
}
