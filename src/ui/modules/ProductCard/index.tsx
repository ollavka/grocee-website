'use client'

import { FC, useMemo } from 'react'
import Link from 'next/link'
import { Tag, Button, PayloadImage } from 'ui'
import { Heart, StarHalfFilled } from '@oleksii-lavka/grocee-icons/icons'
import { FocusRing } from 'react-aria'
import { clsx } from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useGlobalTypography, useShoppingBasket } from 'store'
import Skeleton from 'react-loading-skeleton'
import { MappedProduct } from '../../types'

export type ProductCardProps = {
  product: MappedProduct
  isFavorite?: boolean
  imageHeight?: number
  minImageWidth?: number
  imageClassName?: string
  className?: string
  animationProps?: HTMLMotionProps<'div'>
  // eslint-disable-next-line no-unused-vars
  onAddToCartClick?: (product: MappedProduct) => void
  onClickLikeButton?: () => void
  isLoadingButton?: boolean
}

export const ProductCard: FC<ProductCardProps> = props => {
  const {
    product,
    imageClassName = '',
    className = '',
    imageHeight = 176,
    minImageWidth = 0,
    onAddToCartClick,
    onClickLikeButton,
    animationProps = {},
    isLoadingButton,
  } = props

  const { productButtons } = useGlobalTypography()
  const { lineItems } = useShoppingBasket()

  const isProductInCart = useMemo(() => {
    return lineItems.some(lineItem => lineItem.id === product.id)
  }, [lineItems, product])

  return (
    <motion.div
      className={clsx('flex flex-col gap-4 rounded-2xl bg-gray-25 p-4', className)}
      {...animationProps}
    >
      <div className='relative'>
        <FocusRing focusRingClass='ring ring-offset-2'>
          <Link href={product.pageUrl ?? ''} className='inline-block w-full no-underline'>
            {product?.tag && (
              <div style={{ zIndex: 2 }} className='absolute left-0 top-0'>
                <Tag text={product.tag} />
              </div>
            )}

            <div
              className='relative w-full overflow-hidden rounded-lg bg-white'
              style={{ paddingBottom: imageHeight, minWidth: minImageWidth }}
            >
              <PayloadImage
                src={product.previewImage}
                skipBlur
                imgProps={{
                  className: clsx(
                    'absolute left-0 top-0 object-contain mix-blend-multiply',
                    imageClassName,
                  ),
                }}
              />
            </div>
          </Link>
        </FocusRing>

        <div style={{ zIndex: 2 }} className='absolute right-0 top-0'>
          <Button className='p-3' variant='tertiary' onClick={onClickLikeButton}>
            <Heart width={18} height={16} className='text-gray-900' />
          </Button>
        </div>
      </div>

      <div className='flex grow flex-col gap-2'>
        <span className='gilroy-xl text-gray-900'>{product.name}</span>

        <div className='flex justify-between gap-2'>
          <span className='gilroy-sm text-gray-800'>{product.weightLabel}</span>
          <div className='flex items-center gap-1'>
            <StarHalfFilled width={15} height={14} />
            <span className='gilroy-sm text-gray-800'>{product.rating}</span>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-1 rounded-[1000px] bg-white pl-6'>
        <span className='gilroy-md text-center text-gray-900'>
          {product.price.currency.text} {product.price.amount}
        </span>

        {productButtons.addToCartButton ? (
          <Button
            standartButton
            onClick={() => {
              onAddToCartClick?.(product)
            }}
            isLoading={isLoadingButton}
            rightIcon={{
              icon: isProductInCart ? 'PlusCircle' : 'AddShoppingCart',
              size: { height: 19, width: 18 },
            }}
          />
        ) : (
          <div className='min-h-full w-[120px]'>
            <Skeleton borderRadius={1000} className='inline-block min-h-12 w-full' />
          </div>
        )}
      </div>
    </motion.div>
  )
}
