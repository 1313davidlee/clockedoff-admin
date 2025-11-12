import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.ok) {
      router.replace('/').catch(() => {});
    } else {
      setError('Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-md admin-surface p-8 bg-white">
        <h1 className="text-3xl font-bold text-center text-[var(--color-black)] uppercase mb-4">ClockedOff Admin</h1>
        <div className="admin-divider mb-6" />
        <p className="text-center text-[var(--color-black)]/70 mb-6 uppercase text-xs tracking-[0.3em]">Authorized Access Only</p>
        {error && <p className="mb-4 text-sm text-[var(--color-red)] text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--color-black)] mb-2">Username</label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-[var(--color-black)] bg-[var(--color-cream)] px-3 py-2 focus:outline-none focus:border-[var(--color-red)]"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--color-black)] mb-2">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-[var(--color-black)] bg-[var(--color-cream)] px-3 py-2 focus:outline-none focus:border-[var(--color-red)]"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="admin-button w-full disabled:opacity-70">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
