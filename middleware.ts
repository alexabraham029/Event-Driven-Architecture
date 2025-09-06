import { clerkMiddleware } from '@clerk/nextjs/server'
import { authMiddleware,clerkClient} from '@clerk/nextjs/server'
import { NextRequest,NextResponse} from 'next/server';
const publicRoutes =[
    '/',
    '/api/webhook/register',
    '/sign-in',
    '/sign-up'
]
export default clerkMiddleware({
    publicRoutes,
    async afterAuth(auth,req){
        if(!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }
        if(auth.userId)
        {
            try {
                const user = await clerkClient.users.getUser(auth.userId);
                const role = user.publicMetadata.role as string | undefined;
                if(role==='admin' && req.nextUrl.pathname.startsWith('/dashboard')){
                return NextResponse.redirect(new URL('/admin/dashboard',req.url))
                }
                if(role==='user' && req.nextUrl.pathname.startsWith('/admin')){
                    return NextResponse.redirect(new URL('/dashboard',req.url))}
                if(publicRoutes.includes(req.nextUrl.pathname)){
                return NextResponse.redirect(new URL(role==='admin'?'/admin/dashboard':'/dashboard',req.url))
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                return NextResponse.redirect(new URL('/error',req.url))
                
            }
        }
        
    
}})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}