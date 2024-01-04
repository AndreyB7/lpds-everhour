export { default } from 'next-auth/middleware'

export const config = {
  // protected urls
  matcher: [
    '/parameters',
    '/project/:path*',
    '/team'
  ]
}