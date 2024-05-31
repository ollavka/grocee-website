import { getMetadata, getPage, getPaginatedCollection } from '@/cms'
import { renderBlocks } from '@/cms/helpers'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import clsx from 'clsx'
import { ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from 'ui'
import { mapBreadcrumbs } from 'ui/helpers'
import { NewsList } from './news-list'
import { mapCMSNewsCards } from '@/helpers/mapCMSNewsCards'

export async function generateMetadata(route: any, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('pages', 'news', { searchParams: { locale } }, parent)
}

export default async function Page() {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const page = await getPage('pages', 'news', {
      searchParams: { locale },
    })

    if (!page) {
      notFound()
    }

    const fetchNews = async (page?: number) => {
      'use server'

      const news = await getPaginatedCollection(
        'news',
        { pageLimit: 12, page, sortBy: '-createdAt' },
        { searchParams: { locale } },
      ).then(async ({ docs: news, totalDocs, totalPages }) => {
        const mappedNews = await mapCMSNewsCards(news, locale)

        return {
          news: mappedNews,
          totalDocs,
          totalPages,
        }
      })

      return news
    }

    const mappedBreadcrumbs = mapBreadcrumbs(page.breadcrumbs)

    return (
      <div className='mt-[120px] tablet:mt-[150px]'>
        <SetupEdgeBlocksOnPage layout={[]} />

        <Breadcrumbs className='width-limit my-8' breadcrumbs={mappedBreadcrumbs} />

        {(page?.layout?.length ?? 0) > 0 && (
          <div
            className={clsx('mx-auto mt-8 flex flex-col gap-16 laptop:mt-10 laptop:gap-20', {
              'max-w-[900px]': page?.layoutHasWidthLimit,
            })}
          >
            {renderBlocks(page.layout)}
          </div>
        )}

        <div className='width-limit mt-8 tablet:mt-12 laptop:mt-[72px]'>
          <NewsList fetchNews={fetchNews} title={page?.title ?? ''} />
        </div>
      </div>
    )
  } catch (err) {
    notFound()
  }
}
