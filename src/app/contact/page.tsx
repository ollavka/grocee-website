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
import { ContactsPage } from './contacts-page'

export async function generateMetadata({ params }: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('pages', 'contact', { searchParams: { locale } }, parent)
}

export default async function Page({ params }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const page = await getPage('pages', 'contact', {
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
          <ContactsPage
            breadcrumbs={mappedBreadcrumbs}
            pageTitle={page.title ?? ''}
            pageSubtitle={page.subtitle ?? ''}
          />
        </div>

        {(page?.layout?.length ?? 0) > 0 && (
          <div
            className={clsx('mt-8 flex flex-col gap-16 laptop:mt-10 laptop:gap-20', {
              'mx-auto box-content max-w-[900px] px-4 tablet:px-5 laptop:px-12 desktop:px-[100px]':
                page?.layoutHasWidthLimit,
              'width-limit': !page.layoutHasWidthLimit,
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
