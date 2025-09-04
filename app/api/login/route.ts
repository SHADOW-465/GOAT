import { NextResponse } from 'next/server';

// POST /api/login - Dummy login system
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Hardcoded user accounts
    const employeeUser = {
      email: 'alex.employee@goat.media',
      password: 'password123',
      payload: {
        id: 'clxne14a5000008l3fjd5g1z2', // Static ID for demo purposes
        name: 'Alex Doe',
        role: 'EMPLOYEE',
        designation: 'Content Creator',
      },
    };

    const executiveUser = {
      email: 'mia.exec@goat.media',
      password: 'password123',
      payload: {
        id: 'clxne14a5000108l3fjd5g1z3', // Static ID for demo purposes
        name: 'Mia Wong',
        role: 'EXECUTIVE',
        designation: 'Head of Operations',
      },
    };

    if (email === employeeUser.email && password === employeeUser.password) {
      // In a real app, you would generate a real JWT here
      const dummyToken = `dummy-jwt-for-${employeeUser.payload.id}`;
      return NextResponse.json({ token: dummyToken, user: employeeUser.payload });
    }

    if (email === executiveUser.email && password === executiveUser.password) {
      const dummyToken = `dummy-jwt-for-${executiveUser.payload.id}`;
      return NextResponse.json({ token: dummyToken, user: executiveUser.payload });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
