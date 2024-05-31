import dayjs from 'dayjs'

import { getCollection } from '@/cms'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${await generateSiteMapEntries('pages')}
        ${await generateSiteMapEntries('newsPages')}
        ${await generateSiteMapEntries('productPages')}
      </urlset>
    `.replace(/\n\s+/g, ''),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  )
}

const generateSiteMapEntries = async (collection: 'pages' | 'newsPages' | 'productPages') => {
  const entries = await getCollection(collection)

  let baseUrl = ''

  switch (collection) {
    case 'newsPages':
      baseUrl = 'news/'
      break
    case 'productPages':
      baseUrl = 'product/'
      break
    case 'pages':
    default:
  }

  return entries.map(entry => generateSitemapEntry(baseUrl + entry.slug, entry.updatedAt)).join('')
}

const generateSitemapEntry = (slug: string, updated?: Date | string) => {
  const updatedDate = dayjs(updated).format('YYYY-MM-DD')

  return `
    <url>
      <loc>${process.env.WEBSITE_PUBLIC_URL}/${slug}</loc>${
        updated != null ? `<lastmod>${updatedDate}</lastmod>` : ''
      }</url>
  `
}
