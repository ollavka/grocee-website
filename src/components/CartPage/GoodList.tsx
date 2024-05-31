'use client'

import { FC, useCallback, useMemo } from 'react'
import { useGlobalTypography, useShoppingBasket } from '@/store'
import clsx from 'clsx'
import { PayloadImage } from 'ui'
import { Close, Minus, Plus } from '@oleksii-lavka/grocee-icons/icons'
import { Currency, ShippingRate, Unit } from 'cms-types'
import { MappedProduct } from 'ui/types'
import { useWindowSize } from 'ui/hooks'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  className?: string
  nextShippingRate: ShippingRate | null
  goodsPriceAmount: number
}

export const GoodList: FC<Props> = ({ className, nextShippingRate, goodsPriceAmount }) => {
  const { lineItems, addLineItem, removeLineItem } = useShoppingBasket()
  const { isTablet, isDesktop, isMobile } = useWindowSize()
  const { minOrderPriceRequiredWarning, minOrderPrice } = useGlobalTypography(state => state.cart)

  const mappedMinOrderPriceWaning = useMemo(() => {
    if (goodsPriceAmount >= minOrderPrice.uah) {
      return null
    }
    //! Replace curreny in future
    const label = minOrderPriceRequiredWarning.replace('{{min_price}}', `${minOrderPrice.uah} UAH`)

    return label
  }, [minOrderPriceRequiredWarning, minOrderPrice, goodsPriceAmount])

  const mappedNextShippingRate = useMemo(() => {
    if (!nextShippingRate || !nextShippingRate?.label) {
      return null
    }

    const label = nextShippingRate.label
      .replace(
        '{{order_amount}}',
        `${Math.abs(nextShippingRate.minOrderPrice - goodsPriceAmount)} ${(nextShippingRate.currency as Currency).text}`,
      )
      .replace(
        '{{shipping_amount}}',
        `${nextShippingRate.amount} ${(nextShippingRate.currency as Currency).text}`,
      )

    return label
  }, [nextShippingRate, goodsPriceAmount])

  const getLineItemCount = useCallback(
    (product: MappedProduct & { quantity?: number }) => {
      const mappedQuantity = product.productDetails?.weightStep
        ? (product.quantity! * product.productDetails.weightStep) / 1000
        : product.quantity!

      return mappedQuantity
    },
    [lineItems],
  )

  const truncateProductName = useCallback(
    (name: string) => {
      const min = isDesktop ? 16 : 12
      const end = !isTablet ? 9 : 12

      return name.length > min ? `${name.slice(0, end)}...` : name
    },
    [isTablet, isDesktop],
  )

  return (
    <div className={clsx('flex flex-col gap-8', className)}>
      <AnimatePresence>
        {(mappedMinOrderPriceWaning || mappedNextShippingRate) && (
          <motion.p
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            className='gilroy-sm rounded-lg bg-gray-25 p-2 font-light text-gray-900 tablet:p-4 tablet:text-[16px] tablet:leading-[150%] laptop:text-[20px] laptop:font-normal'
          >
            {mappedMinOrderPriceWaning || mappedNextShippingRate}
          </motion.p>
        )}
      </AnimatePresence>

      <ul className='flex max-h-[418px] flex-col gap-4 overflow-y-auto laptop:max-h-[355px]'>
        {lineItems.map((product, idx) => {
          const { id, name, weightLabel, previewImage, unit, quantity, price } = product

          return (
            <li
              key={id}
              className={clsx('flex justify-between gap-2 laptop:gap-16', {
                'border-b-[1px] border-gray-100 pb-4': idx !== lineItems.length - 1 || isMobile,
              })}
            >
              <div className='flex shrink-0 grow basis-[67%] flex-col gap-4 laptop:grow-0 laptop:flex-row laptop:items-center laptop:justify-between'>
                <div className='flex items-start gap-2'>
                  <div className='relative h-16 w-16 overflow-hidden rounded-lg bg-gray-25'>
                    <PayloadImage
                      src={previewImage}
                      skipBlur
                      imgProps={{
                        className:
                          'absolute left-0 top-0 w-full h-full object-contain mix-blend-multiply',
                      }}
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <h4 className='gilroy-xl text-balance text-gray-900'>
                      {truncateProductName(name)}
                    </h4>
                    <span className='gilroy-sm font-light text-gray-700'>{weightLabel}</span>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='gilroy-sm hidden text-gray-900 min-[1440px]:block'>
                    {(price.currency as Currency).text} {price.fullAmount}
                  </span>
                  <div className='flex max-w-fit items-center gap-1 rounded bg-gray-25 p-1'>
                    <button
                      onClick={() => removeLineItem(product.id)}
                      className={clsx({
                        'pointer-events-none': (quantity ?? 1) <= 1,
                      })}
                    >
                      <Minus
                        size={24}
                        className={clsx('p-[6px] transition-colors duration-300', {
                          'text-gray-900': (quantity ?? 1) > 1,
                          'text-gray-500': (quantity ?? 1) <= 1,
                        })}
                      />
                    </button>
                    <span className='gilroy-md flex w-[55px] items-center justify-center font-semibold text-gray-900'>
                      {getLineItemCount(product)} {(unit as Unit).text}
                    </span>
                    <button onClick={() => addLineItem({ ...product, quantity: 1 })}>
                      <Plus size={24} className='p-[6px] text-gray-900' />
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end justify-between gap-4 text-center laptop:flex-row-reverse laptop:items-center laptop:gap-2'>
                <button
                  onClick={() => removeLineItem(product.id, { full: true })}
                  className='cursor-pointer p-[5px] text-gray-900'
                >
                  <Close size={12} />
                </button>

                <span className='gilroy-xl text-gray-900'>{`${price.currency.text} ${(quantity! * price.fullAmount).toFixed(2)}`}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
