'use client'

import { FC } from 'react'
import { ProductCardSkeleton } from 'ui/skeletons'

export const SearchPageSkeleton: FC = () => {
  return (
    <div className='grid-layout'>
      {Array.from({ length: 12 }, (_, idx) => (
        <div key={idx} className='col-span-2 laptop:col-span-4 desktop:col-span-3'>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}
