import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { checkInSchema } from '@/lib/schemas';
import { prisma } from '@/lib/db';

export const POST = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const body = await parseBody(req, checkInSchema);
  const checkIn = await prisma.checkIn.create({
    data: { userId, type: body.type, data: JSON.stringify(body.data) },
  });
  return NextResponse.json({ id: checkIn.id });
});

export const GET = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const type = new URL(req.url).searchParams.get('type') ?? undefined;
  const checkIns = await prisma.checkIn.findMany({
    where: { userId, ...(type ? { type } : {}) },
    orderBy: { date: 'desc' },
    take: 30,
  });
  return NextResponse.json({
    checkIns: checkIns.map((c) => ({ id: c.id, type: c.type, date: c.date, data: JSON.parse(c.data) as unknown })),
  });
});
