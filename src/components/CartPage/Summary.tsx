'use client'

import { FC, useCallback } from 'react'
import { useGlobalTypography, useShoppingBasket } from '@/store'
import clsx from 'clsx'
import { ShippingRate } from 'cms-types'
import { Button } from 'ui'
import toast from 'react-hot-toast'
import { CheckoutButton } from './CheckoutButton'
import { createCheckout } from '@/actions'

type Props = {
  className?: string
  shippingRate: ShippingRate
  goodsPriceAmount: number
}

export const Summary: FC<Props> = ({ className, shippingRate, goodsPriceAmount }) => {
  const { summary, minOrderPrice, goodsAmountLessThanMinError, createCheckoutError } =
    useGlobalTypography(state => state.cart)
  const { lineItems, setCheckoutId } = useShoppingBasket()

  const handleCreateCheckout = useCallback(async () => {
    if (goodsPriceAmount < minOrderPrice.uah) {
      toast.error(goodsAmountLessThanMinError)

      return
    }

    try {
      const { checkout, redirectToCheckout } = await createCheckout(
        lineItems,
        shippingRate?.shippingRateID,
      )

      if (!checkout.url || !checkout.id) {
        throw new Error()
      }

      setCheckoutId(checkout.id)

      redirectToCheckout(checkout.url)
    } catch (err: unknown) {
      toast.error(createCheckoutError || (err as Error).message)
    }
  }, [
    minOrderPrice,
    createCheckoutError,
    goodsPriceAmount,
    shippingRate,
    lineItems,
    goodsAmountLessThanMinError,
  ])

  return (
    <div className={clsx('flex flex-col gap-6 tablet:gap-8 laptop:gap-10', className)}>
      <h2 className='helvetica-xs font-light text-gray-900'>{summary.title}</h2>

      <ul className='flex flex-col gap-2'>
        <li className='flex items-center justify-between gap-2'>
          <span className='gilroy-md block grow text-gray-700'>{summary.deliveyAmountLabel}</span>
          <span className='gilroy-md block text-gray-900'>
            {!shippingRate?.amount
              ? summary.freeDeliveryLabel
              : `UAH ${shippingRate?.amount.toFixed(2)}`}
          </span>
        </li>
        <li className='flex items-center justify-between gap-2'>
          <span className='gilroy-md block grow text-gray-700'>{summary.goodsAmountLabel}</span>
          <span className='gilroy-md block text-gray-900'>UAH {goodsPriceAmount.toFixed(2)}</span>
        </li>
        <li className='flex items-center justify-between gap-2'>
          <span className='gilroy-md block grow text-gray-700'>{summary.discountAmountLabel}</span>
          <span className='gilroy-md block text-gray-900'>-</span>
        </li>
      </ul>

      <ul className='flex flex-col gap-2 border-b-[1px] border-gray-100 pb-6 tablet:pb-8 laptop:pb-10'>
        <li className='flex items-center justify-between gap-2'>
          <span className='gilroy-md block grow text-gray-700'>{summary.addPromocodeLabel}</span>
          <Button variant='tertiary' className='px-3 py-1' rightIcon={{ icon: 'Plus', size: 12 }}>
            {summary.addDiscountButtonLabel}
          </Button>
        </li>
        <li className='flex items-center justify-between gap-2'>
          <span className='gilroy-md block grow text-gray-700'>{summary.addCertificateLabel}</span>
          <Button variant='tertiary' className='px-3 py-1' rightIcon={{ icon: 'Plus', size: 12 }}>
            {summary.addDiscountButtonLabel}
          </Button>
        </li>
      </ul>

      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between gap-2'>
          <span className='gilroy-xl text-gray-700'>{summary.totalSumLabel}</span>
          <span className='gilroy-xl text-gray-900'>
            UAH {(goodsPriceAmount + (shippingRate ? shippingRate?.amount ?? 0 : 0)).toFixed(2)}
          </span>
        </div>

        <form action={handleCreateCheckout} className='flex'>
          <CheckoutButton isDisabled={goodsPriceAmount < minOrderPrice.uah}>
            {summary.checkoutButtonLabel}
          </CheckoutButton>
        </form>
      </div>
    </div>
  )
}
