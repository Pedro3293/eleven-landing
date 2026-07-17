import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserId } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { AccountSection } from '@/components/settings/AccountSection';

export const metadata = { title: 'Ajustes — FORGE' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/onboarding');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  const isAnonymous = !user || user.email.endsWith('@forge.local');

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-2">
        <Link href="/dashboard" aria-label="Volver al panel" className="flex h-11 w-11 items-center justify-center rounded-full text-muted active:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Ajustes</h1>
      </header>
      <AccountSection email={isAnonymous ? null : user!.email} />
    </main>
  );
}
