export { default } from 'next-auth/middleware'

export const config = {
  // protected urls
  matcher: [
    '/parameters',
    '/dashboard',
    '/dashboard/(.*)',
    '/project/:path*',
    '/team'
  ]
}