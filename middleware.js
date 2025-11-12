import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const PUBLIC_PATHS = ['/login', '/api/auth'];

export default auth((req) => {
  const { nextUrl } = req;
  const isPublic = PUBLIC_PATHS.some((path) =>
    path === '/api/auth' ? nextUrl.pathname.startsWith(path) : nextUrl.pathname === path,
  );

  if (!req.auth && !isPublic) {
    const signInUrl = new URL('/login', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  if (req.auth && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico).*)',
  ],
};
