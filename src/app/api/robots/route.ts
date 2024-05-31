// @ts-nocheck
import dedent from 'dedent'

export const dynamic = 'force-static'

export async function GET() {
  if (/^(?:http|https):\/\/dev\./.test(process.env.NEXT_PUBLIC_WEBSITE_PUBLIC_URL!)) {
    return new Response(dedent`
      User-agent: *
      Disallow: /

      Sitemap: ${process.env.NEXT_PUBLIC_WEBSITE_PUBLIC_URL}/sitemap.xml
    `)
  }

  return new Response(dedent`
    User-agent: *
    Allow: /

    Sitemap: ${process.env.NEXT_PUBLIC_WEBSITE_PUBLIC_URL}/sitemap.xml
  `)
}
