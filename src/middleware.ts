import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getCollection } from '@/cms'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'

const ACCEPT_LANGUAGES = ['ua', 'en']

export async function middleware(request: NextRequest) {
  const redirects = await getCollection('redirects')

  if (redirects?.length > 0) {
    const redirectTo = redirects.find(redirect => {
      return redirect.from === request.nextUrl.pathname
    })

    const redirectToUrl = parsePayloadLink(redirectTo?.to)

    if (redirectToUrl) {
      const { href } = new URL(redirectToUrl, request.url)

      return NextResponse.redirect(href)
    }
  }

  const response = NextResponse.next()

  if (!request.cookies.get('locale')?.value) {
    const acceptLanguage = request.headers.get('Accept-Language')?.slice(0, 2)

    if (acceptLanguage && ACCEPT_LANGUAGES.includes(acceptLanguage)) {
      response.cookies.set('locale', acceptLanguage)
    } else {
      response.cookies.set('locale', 'en')
    }
  } else {
    const currentLocale = request.cookies.get('locale')?.value as string

    if (ACCEPT_LANGUAGES.includes(currentLocale)) {
      response.cookies.set('locale', currentLocale)
    } else {
      response.cookies.set('locale', 'en')
    }
  }

  return response
}

export const config = {
  runtime: 'experimental-edge',
  unstable_allowDynamic: [
    '**/node_modules/lodash/_root.js',
    '**/node_modules/lodash.debounce/index.js',
    '**/node_modules/lodash/lodash.js',
    '**/node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js',
  ],
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
