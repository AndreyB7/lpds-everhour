// auth middleware
export function isLoggedIn(req: any, res: any, next: any) {
  if (req.session?.login !== true) {
    res.redirect('/login')
    return
  }
  next();
}