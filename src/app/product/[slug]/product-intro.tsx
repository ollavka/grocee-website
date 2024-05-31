'use client'

import { ComponentProps, FC } from 'react'
import { ProductControls, ProductPageSlider } from 'ui'
import { ReviewsBlock } from 'ui/modules/ProductControls/ReviewsBlock'

type Props = ComponentProps<typeof ProductPageSlider> & ComponentProps<typeof ProductControls>

export const ProductIntro: FC<Props> = ({ productGallery, product, fetchReviews }) => {
  return (
    <div className='grid-layout'>
      <div className='col-span-full tablet:col-span-3 laptop:col-span-7'>
        {productGallery.length > 0 && (
          <div className='grid grid-cols-7 gap-8'>
            <div className='col-span-full laptop:col-span-6'>
              <ProductPageSlider className='mb-6 tablet:mb-0' productGallery={productGallery} />
            </div>
          </div>
        )}

        <ReviewsBlock
          className='mt-16 !hidden tablet:!flex'
          productId={product.id}
          fetchReviews={fetchReviews}
          rating={product.rating ?? 0}
        />
      </div>
      <ProductControls
        className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'
        product={product}
        fetchReviews={fetchReviews}
      />
    </div>
  )
}
