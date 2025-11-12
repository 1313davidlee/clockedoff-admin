import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function AdminNavbar() {
  const { data: session } = useSession();
  const displayName = session?.user?.name || session?.user?.username || 'Admin';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' }).catch(() => {});
  };

  return (
    <header className="w-full bg-[var(--color-cream)] border-b-2 border-[var(--color-black)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center gap-2">
              <Image src="/public/clockedoff-logo.gif" alt="ClockedOff logo" width={150} height={60} priority />
              <span className="text-xl font-semibold tracking-tight group-hover:text-[var(--color-red)] transition-colors">Admin</span>
            </span>
          </Link>
          <span className="text-sm text-[var(--color-black)]">
            Signed in as <span className="font-bold">{displayName}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 md:justify-end w-full md:w-auto">
          <Link href="/" className="admin-button secondary text-xs sm:text-sm">
            Home
          </Link>
          <button type="button" onClick={handleSignOut} className="admin-button text-xs sm:text-sm">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
