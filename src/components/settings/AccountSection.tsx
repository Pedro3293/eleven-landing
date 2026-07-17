'use client';

/** Cuenta: alta/login (reclama la cuenta anónima), exportación y borrado (GDPR). */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, LogOut, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Sheet } from '@/components/ui/Sheet';

export function AccountSection({ email }: { email: string | null }) {
  const router = useRouter();
  const [mode, setMode] = useState<'register' | 'login'>(email ? 'login' : 'register');
  const [formEmail, setFormEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  async function submitAuth() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, email: formEmail, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error');
      router.refresh();
      setMsg(mode === 'register' ? 'Cuenta creada. Tu progreso queda guardado con este email.' : 'Sesión iniciada.');
      setPassword('');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Algo ha fallado.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    router.push('/');
    router.refresh();
  }

  async function deleteAccount() {
    setBusy(true);
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: confirmText }),
      });
      if (!res.ok) throw new Error();
      router.push('/');
      router.refresh();
    } catch {
      setMsg('No se ha podido borrar la cuenta. Comprueba la confirmación.');
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent/15 text-accent">
            {email ? <ShieldCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </span>
          <div>
            <p className="font-semibold">{email ? 'Tu cuenta' : 'Guarda tu progreso'}</p>
            <p className="text-xs text-muted">
              {email ?? 'Ahora mismo tus datos viven solo en este dispositivo. Crea una cuenta para no perderlos.'}
            </p>
          </div>
        </div>

        {!email && (
          <>
            <div className="flex gap-2 text-sm">
              <button onClick={() => setMode('register')} className={`flex-1 rounded-control border py-2.5 ${mode === 'register' ? 'border-accent text-accent' : 'border-line text-muted'}`}>
                Crear cuenta
              </button>
              <button onClick={() => setMode('login')} className={`flex-1 rounded-control border py-2.5 ${mode === 'login' ? 'border-accent text-accent' : 'border-line text-muted'}`}>
                Ya tengo cuenta
              </button>
            </div>
            <Input label="Email" type="email" autoComplete="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="tu@email.com" />
            <Input
              label="Contraseña"
              type="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint={mode === 'register' ? 'Mínimo 8 caracteres.' : undefined}
            />
            <Button loading={busy} disabled={!formEmail || password.length < 8} onClick={() => void submitAuth()}>
              {mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
            <p className="text-xs text-muted">
              Google y Apple llegarán con la app nativa; de momento email y contraseña.
            </p>
          </>
        )}
        {email && (
          <Button variant="secondary" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" aria-hidden /> Cerrar sesión
          </Button>
        )}
        {msg && <p className="text-sm text-muted" role="status">{msg}</p>}
      </Card>

      <Card className="flex flex-col gap-3">
        <p className="font-semibold">Tus datos</p>
        <a href="/api/account" download className="contents">
          <Button variant="secondary" className="justify-start">
            <Download className="h-5 w-5 text-accent" aria-hidden /> Descargar todos mis datos (JSON)
          </Button>
        </a>
        <Button variant="danger" className="justify-start" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-5 w-5" aria-hidden /> Borrar mi cuenta y todos mis datos
        </Button>
      </Card>

      <Sheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Borrar cuenta">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Se eliminarán de forma definitiva tu perfil, plan, sesiones, check-ins, chats y fotos. No hay vuelta atrás.
          </p>
          <Input label="Escribe ELIMINAR para confirmar" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          <Button variant="danger" size="lg" loading={busy} disabled={confirmText !== 'ELIMINAR'} onClick={() => void deleteAccount()}>
            Borrar definitivamente
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
