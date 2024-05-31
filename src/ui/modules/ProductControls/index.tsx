'use client'

import { Country, Feedback, Taste, Trademark, Unit } from 'cms-types'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { MappedProduct } from '../../types'
import { useGlobalTypography, useShoppingBasket } from 'store'
import { PoductControlsSkeleton } from '@/components/ProductPageSkeletons'
import { AccordionInfo } from './AccordionInfo'
import { Heart, Minus, Plus } from '@oleksii-lavka/grocee-icons/icons'
import { ReviewsBlock } from './ReviewsBlock'
import { Button } from '../..'
import { clsx } from 'clsx'
import { WithSkeletonLoader } from '../../hoc'
import toast from 'react-hot-toast'

type Props = {
  className?: string
  product: MappedProduct
  // eslint-disable-next-line no-unused-vars
  fetchReviews: (page: number) => Promise<{
    docs: Feedback[]
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }>
}

export const ProductControls: FC<Props> = WithSkeletonLoader(
  ({ product, fetchReviews, className = '' }: Props) => {
    const quantityStep = useRef(
      (product.productDetails?.weightStep ?? 0) > 0
        ? product.productDetails?.weightStep! / 1000
        : 1,
    )

    const { productPage, productButtons, cart } = useGlobalTypography()
    const { lineItems, addLineItem } = useShoppingBasket()
    const [quantity, setQuantity] = useState(quantityStep.current)

    const isProductInCart = useMemo(() => {
      return lineItems.some(lineItem => lineItem.id === product.id)
    }, [lineItems, product])

    const onAddToCartClick = useCallback(
      (product: MappedProduct) => {
        addLineItem({ ...product, quantity: quantity / quantityStep.current })
        toast.success(cart.addToCartSuccess)
      },
      [lineItems, cart, quantity],
    )

    const productName = !product.productDetails?.weight
      ? `${product.name}, ${product.weightLabel}`
      : product.name

    const generalInfoOptions = useMemo(() => {
      const { country, trademark, taste, alcoholPercentage, weight, unit } = product.productDetails

      const options = [
        {
          label: productPage.generalInfo.country,
          value: (country as Country)?.label,
        },
        {
          label: productPage.generalInfo.trademark,
          value: (trademark as Trademark)?.label,
        },
        {
          label: productPage.generalInfo.weight,
          value: (unit as Unit).label === 'piece' ? (weight! / 1000).toFixed(1) : 1,
        },
      ]

      if ((unit as Unit).label === 'piece') {
        options.push({
          label: productPage.generalInfo.numberOfUnits,
          value: 1,
        })
      }

      if (taste) {
        options.push({
          label: productPage.generalInfo.taste,
          value: (taste as Taste).label,
        })
      }

      if (alcoholPercentage) {
        options.push({
          label: productPage.generalInfo.alcoholPercentage,
          value: alcoholPercentage.toFixed(1),
        })
      }

      return options
    }, [product, productPage.generalInfo])

    const nutritionalInfoOptions = useMemo(() => {
      const { energyValue, carbohydrates, proteins, fats } = product.nutritionalValue

      const options = [
        {
          label: productPage.nutritionalValue.energyValue,
          value: `${energyValue}/${Math.ceil(+energyValue * 4.184)}`,
        },
        {
          label: productPage.nutritionalValue.proteins,
          value: proteins,
        },
        {
          label: productPage.nutritionalValue.fats,
          value: fats,
        },
        {
          label: productPage.nutritionalValue.carbohydrates,
          value: carbohydrates,
        },
      ]

      return options
    }, [product, productPage.nutritionalValue])

    return (
      <div className={clsx('flex flex-col gap-8 tablet:gap-10', className)}>
        <div className='flex flex-col gap-4 tablet:gap-10'>
          <div className='order-first flex flex-col gap-4'>
            <div className='flex items-center justify-between gap-2'>
              <h3 className='helvetica-xs font-light text-gray-900 tablet:text-[36px] tablet:leading-[122%] tablet:tracking-tightest'>
                {productName}
              </h3>
              <Button className='p-3' variant='secondary' onClick={() => {}}>
                <Heart width={18} height={16} className='text-gray-900' />
              </Button>
            </div>
            <p className='gilroy-xl font-light leading-[133%] text-gray-900 tablet:text-[24px]'>{`${product.price.amount} ${product.price.currency.text}`}</p>
          </div>

          <div className='flex flex-col gap-4 tablet:gap-6'>
            <div className='flex items-center justify-between gap-2'>
              <span className='gilroy-xl text-gray-900'>{productPage.quantityLabel}</span>
              <div className='flex items-center gap-1 rounded bg-gray-25 p-1'>
                <button
                  onClick={() => setQuantity(prev => prev - quantityStep.current)}
                  className={clsx({
                    'pointer-events-none': quantity === quantityStep.current,
                  })}
                >
                  <Minus
                    size={24}
                    className={clsx('p-[6px] transition-colors duration-300', {
                      'text-gray-900': quantity !== quantityStep.current,
                      'text-gray-500': quantity === quantityStep.current,
                    })}
                  />
                </button>
                <span className='gilroy-md flex w-[55px] items-center justify-center font-semibold text-gray-900'>
                  {quantity} {(product.productDetails.unit as Unit).text}
                </span>
                <button onClick={() => setQuantity(prev => prev + quantityStep.current)}>
                  <Plus size={24} className='p-[6px] text-gray-900' />
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-2 tablet:order-1'>
              <Button
                onClick={() => onAddToCartClick(product)}
                variant='primary'
                standartButton
                leftIcon={{ icon: isProductInCart ? 'PlusCircle' : null, size: 18 }}
              >
                {isProductInCart
                  ? productButtons.addedToCartButton
                  : productButtons.addToCartButton}
              </Button>
              <Button variant='secondary' standartButton>
                {productButtons.buyNowButton}
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-6 tablet:-order-[1]'>
            <AccordionInfo title={productPage.generalInfo.title} options={generalInfoOptions} />
            <AccordionInfo
              title={productPage.nutritionalValue.title}
              options={nutritionalInfoOptions}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h4 className='helvetica-xs font-light text-gray-900'>{productPage.descriptionLabel}</h4>
          <p className='gilroy-sm font-light text-gray-800'>{product.description}</p>
        </div>

        <div className='flex flex-col gap-4'>
          <h4 className='helvetica-xs font-light text-gray-900'>
            {productPage.deliveryBlock.title}
          </h4>
          <ul className='flex flex-col gap-2'>
            <li className='justoify-between flex items-center gap-2'>
              <span className='gilroy-sm block grow text-gray-600'>
                {productPage.deliveryBlock.shop}
              </span>
              <span className='gilroy-md block text-gray-700'>
                The address of the nearest store
              </span>
            </li>
            <li className='justoify-between flex items-center gap-2'>
              <span className='gilroy-sm block grow text-gray-600'>
                {productPage.deliveryBlock.fastestDeliveryTime}
              </span>
              <span className='gilroy-md block text-gray-700'>16:00</span>
            </li>
            <li className='justoify-between flex items-center gap-2'>
              <span className='gilroy-sm block grow text-gray-600'>
                {productPage.deliveryBlock.shippingCost}
              </span>
              <span className='gilroy-md block text-gray-700'>150 UAH</span>
            </li>
          </ul>
        </div>

        <ReviewsBlock
          className='tablet:hidden'
          productId={product.id}
          fetchReviews={fetchReviews}
          rating={product.productDetails.rating ?? 0}
        />
      </div>
    )
  },
  ControlsSkeleton,
)

function ControlsSkeleton() {
  return (
    <div className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'>
      <PoductControlsSkeleton />
    </div>
  )
}
