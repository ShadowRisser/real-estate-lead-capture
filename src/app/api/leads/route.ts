import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ZodError, z } from 'zod';

const leadSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  budget: z.string().optional(),
  propertyType: z.string().optional(),
  preferredArea: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = leadSchema.parse(body);

    const lead = await db.lead.create({
      data: {
        ...validated,
        source: validated.source || 'website',
        status: 'new',
      },
    });

    return NextResponse.json(
      { success: true, lead: { id: lead.id, email: lead.email, firstName: lead.firstName } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ success: true, leads, count: leads.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}
