import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PublicRoutes = ["/", "/forget-password"];

function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

function checkRoutePermission(role: string, pathname: string): boolean {
  if (pathname === '/dashboard') {
    return true;
  }
  
  if (pathname.startsWith('/dashboard/usuarios')) {
    if (pathname.includes('/register')) {
      return role === 'ADMIN';
    }
    if (pathname.includes('/edit')) {
      return role === 'ADMIN';
    }
    return role === 'ADMIN' || role === 'USER';
  }
  
  if (pathname.startsWith('/dashboard/clientes')) {
    if (pathname.includes('/register')) {
      return role === 'ADMIN' || role === 'USER';
    }
    if (pathname.includes('/edit')) {
      return role === 'ADMIN' || role === 'USER';
    }
    return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const token = request.cookies.get("token")?.value;
  const authSignature = request.cookies.get("tcn")?.value;

  const publicRoutes = PublicRoutes;
  if (!token && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !authSignature &&
    token &&
    !["/"].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    authSignature &&
    token &&
    publicRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (token && authSignature && request.nextUrl.pathname.startsWith('/dashboard')) {
    const decodedToken = decodeJWT(token);
    
    if (decodedToken) {
      const userRole = decodedToken?.role || decodedToken?.roles?.[0] || 'GUEST';
      
      if (!checkRoutePermission(userRole, request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|api-hml|_next/static|_next/image|assets|favicon.ico).*)"],
};