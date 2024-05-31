import { getPage, searchInCollection } from '@/cms'
import { renderBlocks } from '@/cms/helpers'
import { NextRoute } from '@/types'
import { cookies } from 'next/headers'
import { SetupEdgeBlocksOnPage } from '../components/SetupEdgeBlocksOnPage'
import { SearchPage } from '@/components/SearchPage'
import { parseSearchParams } from 'ui/helpers'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { mapCMSProducts } from '@/helpers/mapCMSProducts'

export default async function HomePage({ searchParams }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    if ('search' in searchParams) {
      const query = parseSearchParams(searchParams, 'search')

      const fetchProducts = async (page?: number) => {
        'use server'

        const data = await searchInCollection(
          'products',
          {
            key: 'name',
            sort: 'name',
            query,
            limit: 1,
            page,
          },
          { searchParams: { locale } },
        ).then(async ({ docs = [], totalDocs, totalPages }) => {
          const mappedProducts = await mapCMSProducts(docs, locale)

          return {
            products: mappedProducts,
            totalDocs,
            totalPages,
          }
        })

        return data
      }

      return (
        <Suspense fallback={null}>
          <SearchPage query={query} fetchProducts={fetchProducts} />
        </Suspense>
      )
    }

    const page = await getPage('pages', 'home', { searchParams: { locale }, throwOnNotFound: true })

    return (
      <>
        <SetupEdgeBlocksOnPage layout={page.layout} />
        {(page?.layout?.length ?? 0) > 0 && (
          <div className='flex flex-col gap-16 laptop:gap-20'>{renderBlocks(page.layout)}</div>
        )}
      </>
    )
  } catch (err: unknown) {
    notFound()
  }
}
