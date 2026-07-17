import { notFound } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth/session';
import { getSessionDetail } from '@/lib/services/plan-service';
import { serializeSession } from '@/lib/services/serialize';
import { Player } from '@/components/player/Player';

export const metadata = { title: 'Sesión — FORGE' };
export const dynamic = 'force-dynamic';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) notFound();
  const { id } = await params;
  try {
    const session = await getSessionDetail(userId, id);
    return <Player initial={serializeSession(session)} />;
  } catch {
    notFound();
  }
}
