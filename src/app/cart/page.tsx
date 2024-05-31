import { getPaginatedCollection, getMetadata, getPage } from '@/cms'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import { NextRoute } from '@/types'
import { cookies } from 'next/headers'
import { Breadcrumbs } from 'ui'
import { mapBreadcrumbs, parseSearchParams } from 'ui/helpers'
import { ShoppingBasket } from '@/components/CartPage/ShoppingBasket'
import { renderBlocks } from '@/cms/helpers'
import { AfterPaymentSuccess } from '@/components/CartPage/AfterPaymentSuccess'
import { AfterPaymentCancel } from '@/components/CartPage/AfterPaymentCancel'
import { ResolvingMetadata } from 'next'

export async function generateMetadata(_: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('categories', 'cart', { searchParams: { locale } }, parent)
}

export default async function Cart({ searchParams }: NextRoute) {
  const locale = cookies().get('locale')?.value ?? 'en'

  if ('paymentStatus' in searchParams) {
    const status = parseSearchParams(searchParams, 'paymentStatus') as 'success' | 'canceled'

    if (status === 'success') {
      return <AfterPaymentSuccess />
    }

    return <AfterPaymentCancel />
  }

  const [cartPage, { docs: shippingRates }] = await Promise.all([
    getPage('pages', 'cart', { searchParams: { locale } }),
    getPaginatedCollection(
      'shippingRates',
      { sortBy: '-minOrderPrice' },
      { searchParams: { locale, limit: '100' } },
    ),
  ])

  const mappedBreadcrumbs = mapBreadcrumbs(cartPage.breadcrumbs)

  return (
    <>
      <SetupEdgeBlocksOnPage layout={cartPage?.layout} />
      <div className='width-limit mt-[120px] flex grow flex-col gap-8 tablet:mt-[150px]'>
        <Breadcrumbs breadcrumbs={mappedBreadcrumbs} />
        <ShoppingBasket pageTitle={cartPage?.title ?? undefined} shippingRates={shippingRates} />
      </div>
      {(cartPage?.layout?.length ?? 0) > 0 && (
        <div className='mt-10 flex grow flex-col gap-16 laptop:mt-20 laptop:gap-20'>
          {renderBlocks(cartPage.layout)}
        </div>
      )}
    </>
  )
}
