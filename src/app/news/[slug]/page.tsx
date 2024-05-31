import { getCollectionItem, getMetadata, getPage } from '@/cms'
import { renderBlocks } from '@/cms/helpers'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import { NextRoute } from '@/types'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from 'ui'
import { mapBreadcrumbs } from 'ui/helpers'
import { ResolvingMetadata } from 'next'
import { richTextToJSX } from '@/helpers/richTextParser'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('newsPages', params.slug, { searchParams: { locale } }, parent)
}

export default async function NewsPage({ params, searchParams }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const [newsArticlePage, newsPage] = await Promise.all([
      getPage('newsPages', params.slug, { searchParams: { locale } }),
      getPage('pages', 'news', { searchParams: { locale } }),
    ])

    if (!newsPage) {
      notFound()
    }

    const news =
      typeof newsArticlePage.news === 'string'
        ? await getCollectionItem(newsArticlePage.news, 'news', { searchParams: { locale } })
        : newsArticlePage.news

    if (!news) {
      notFound()
    }

    const newsUrl =
      news.link.type === 'custom' || typeof news.link.reference?.value !== 'string'
        ? parsePayloadLink(news.link)
        : parsePayloadLink({ ...news.link, reference: { relationTo: 'news', value: news } })

    const mappedBreadcrumbs = mapBreadcrumbs([
      ...(newsPage.breadcrumbs ?? []),
      { label: news.title, url: newsUrl },
    ])

    return (
      <>
        <SetupEdgeBlocksOnPage layout={[]} />
        <div className='width-limit mt-[120px] flex flex-col gap-8 tablet:mt-[150px]'>
          <Breadcrumbs breadcrumbs={mappedBreadcrumbs} />
          <h1 className='helvetica-xs font-light leading-[122%] text-gray-900 tablet:text-[36px] tablet:tracking-tightest'>
            {news.title}
          </h1>
          <div>{richTextToJSX(newsArticlePage.content)}</div>
        </div>
        {(newsArticlePage?.layout?.length ?? 0) > 0 && (
          <div className='mt-8 flex flex-col gap-16 tablet:mt-14 laptop:mt-20 laptop:gap-20'>
            {renderBlocks(newsArticlePage.layout)}
          </div>
        )}
      </>
    )
  } catch (err: unknown) {
    notFound()
  }
}
