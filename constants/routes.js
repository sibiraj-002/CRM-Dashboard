export const PROTECTED_ROUTES = [
  "/",
  "/blogs",
  "/articles",
  "/news",
  "/podcasts",
  "/categories",
  "/media-library",
  "/scheduling",
  "/settings",
];

export const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export const AUTH_REDIRECT_ROUTES = ["/login", "/register"];

export function isProtectedRoute(pathname) {
  if (pathname === "/") {
    return true;
  }

  return PROTECTED_ROUTES.some(
    (route) =>
      route !== "/" &&
      (pathname === route || pathname.startsWith(`${route}/`)),
  );
}

export function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function isAuthRedirectRoute(pathname) {
  return AUTH_REDIRECT_ROUTES.includes(pathname);
}
