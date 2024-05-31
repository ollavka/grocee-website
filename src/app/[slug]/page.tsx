import { getMetadata, getPage } from '@/cms'
import { renderBlocks } from '@/cms/helpers'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import { NextRoute } from '@/types'
import clsx from 'clsx'
import { ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from 'ui'
import { mapBreadcrumbs } from 'ui/helpers'

export async function generateMetadata({ params }: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('pages', params.slug, { searchParams: { locale } }, parent)
}

export default async function Page({ params }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const page = await getPage('pages', params.slug, {
      searchParams: { locale },
    })

    if (!page) {
      notFound()
    }

    const mappedBreadcrumbs = mapBreadcrumbs(page.breadcrumbs)

    return (
      <div className='mt-[120px] tablet:mt-[150px]'>
        <SetupEdgeBlocksOnPage layout={[]} />

        <div className='width-limit flex flex-col gap-8'>
          <Breadcrumbs breadcrumbs={mappedBreadcrumbs} />
          {(page?.title || page?.subtitle) && (
            <div className='flex flex-col gap-2'>
              {page?.title && (
                <h1 className='helvetica-xs font-light leading-[122%] text-gray-900 tablet:text-[36px] tablet:tracking-tightest'>
                  {page.title}
                </h1>
              )}

              {page?.subtitle && (
                <span className='gilroy-sm font-light text-gray-600'>{page.subtitle}</span>
              )}
            </div>
          )}
        </div>

        {(page?.layout?.length ?? 0) > 0 && (
          <div
            className={clsx('mx-auto mt-8 flex flex-col gap-16 laptop:mt-10 laptop:gap-20', {
              'max-w-[900px]': page?.layoutHasWidthLimit,
            })}
          >
            {renderBlocks(page.layout)}
          </div>
        )}
      </div>
    )
  } catch (err) {
    notFound()
  }
}
