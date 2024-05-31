'use client'

import { useGlobalTypography } from '@/store'
import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Sort } from './Sort'
import { Filter } from './Filter'
import { getProductsCountByFilters } from '@/cms'
import { Category } from 'cms-types'

export type FilterButtonProps = Pick<
  Awaited<ReturnType<typeof getProductsCountByFilters>>,
  'filters'
> & {
  category: Category
}

export const FilterButtons: FC<FilterButtonProps> = ({ filters, category }) => {
  const { categoryPage } = useGlobalTypography()

  if (
    !categoryPage.filterProducts.label ||
    !categoryPage.sortProducts.label ||
    !categoryPage.sortProducts.sortParamsChangingMessages.success ||
    !categoryPage.sortProducts.sortParamsChangingMessages.pending
  ) {
    return (
      <div className='flex items-center justify-between tablet:justify-normal tablet:gap-4 laptop:gap-2'>
        <Skeleton width={110} height={48} borderRadius={1000} />
        <Skeleton width={110} height={48} borderRadius={1000} />
      </div>
    )
  }

  return (
    <div className='flex items-center justify-between tablet:justify-normal tablet:gap-4 laptop:gap-2'>
      <Filter
        category={category}
        filterTypography={categoryPage.filterProducts}
        filters={filters}
      />
      <Sort sortTypography={categoryPage.sortProducts} />
    </div>
  )
}
