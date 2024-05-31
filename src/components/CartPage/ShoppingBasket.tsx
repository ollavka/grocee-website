'use client'

import { FC, useMemo } from 'react'
import { useGlobalTypography, useShoppingBasket } from '@/store'
import { Button } from 'ui'
import { GoodList } from './GoodList'
import { Summary } from './Summary'
import { ShippingRate } from 'cms-types'
import { useSSR } from '@/hooks'
import Skeleton from 'react-loading-skeleton'

type Props = {
  shippingRates: ShippingRate[]
  pageTitle?: string
}

export const ShoppingBasket: FC<Props> = ({ shippingRates, pageTitle }) => {
  const { clearBasketLabel, emptyCartLabel } = useGlobalTypography(state => state.cart)
  const { lineItems, clearLineItems } = useShoppingBasket()
  const { isServer } = useSSR()

  const goodsPriceAmount = useMemo(() => {
    return lineItems.reduce((acc, lineItem) => {
      return acc + (lineItem.quantity ?? 1) * lineItem.price.fullAmount
    }, 0)
  }, [lineItems])

  const { currentShippingRate, nextShippingRate } = useMemo(() => {
    let currentShippingRate = shippingRates?.[0] ?? null
    let nextShippingRate = null

    for (let i = 0; i < shippingRates.length; i++) {
      const shippingRate = shippingRates[i]

      if (goodsPriceAmount >= shippingRate.minOrderPrice!) {
        currentShippingRate = shippingRate

        if (i - 1 >= 0) {
          nextShippingRate = shippingRates[i - 1]
        }

        break
      }
    }

    return {
      currentShippingRate,
      nextShippingRate,
    }
  }, [shippingRates, goodsPriceAmount])

  if (isServer) {
    return (
      <div className='flex grow flex-col gap-8 '>
        <div className='flex items-center justify-between'>
          <Skeleton width={65} height={40} />
          <Skeleton width={180} height={32} borderRadius={1000} />
        </div>

        <div className='grid-layout !gap-y-10'>
          <div className='col-span-full tablet:col-span-3 laptop:col-span-6'>
            <div className='flex flex-col gap-4'>
              <Skeleton count={3} borderRadius={8} className='!block w-full' height={64} />
            </div>
          </div>

          <div className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'>
            <Skeleton className='!block w-full' height={400} borderRadius={8} />
          </div>
        </div>
      </div>
    )
  }

  if (!lineItems.length) {
    return (
      <>
        {pageTitle && (
          <h1 className='helvetica-xs leading:[122%] font-light tracking-tightest text-gray-900 tablet:text-[36px]'>
            {pageTitle}
          </h1>
        )}
        <h2 className='helvetica-xs text-center text-success-600'>{emptyCartLabel}</h2>
      </>
    )
  }

  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        {pageTitle && (
          <h1 className='helvetica-xs leading:[122%] font-light tracking-tightest text-gray-900 tablet:text-[36px]'>
            {pageTitle}
          </h1>
        )}
        <Button
          onClick={() => clearLineItems()}
          variant='tertiary'
          className='ml-auto px-3 py-1'
          rightIcon={{ icon: 'CloseCircle', size: 18 }}
        >
          {clearBasketLabel}
        </Button>
      </div>

      <div className='grid-layout !gap-y-10'>
        <GoodList
          goodsPriceAmount={goodsPriceAmount}
          nextShippingRate={nextShippingRate}
          className='col-span-full tablet:col-span-3 laptop:col-span-6'
        />
        <Summary
          className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'
          shippingRate={currentShippingRate}
          goodsPriceAmount={goodsPriceAmount}
        />
      </div>
    </>
  )
}
