import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminNavbar from '@/components/admin-navbar';

function AppShell({ children }) {
  const router = useRouter();
  const hideNav = router.pathname === '/login';

  return (
    <>
      {!hideNav && <AdminNavbar />}
      <main>{children}</main>
    </>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </SessionProvider>
  );
}
