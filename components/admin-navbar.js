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
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center gap-2">
              <Image src="/clockedoff-logo.gif" alt="ClockedOff logo" width={150} height={65} priority />
              <span className="text-lg font-semibold text-gray-900 tracking-tight group-hover:text-blue-600 transition">Admin</span>
            </span>
          </Link>

        </div>
        <div className="flex items-center gap-3 md:justify-end w-full md:w-auto">
        <span className="text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-800">{displayName}</span>
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
