'use client'

import clsx from 'clsx'
import { Category, Subcategory } from 'cms-types'
import { FC } from 'react'
import { SubcategoryList } from './SubcategoryList'
import { FilterButtons } from './FilterButtons'
import { getProductsCountByFilters } from '@/cms'

type Props = {
  category: Category
  className?: string
  filters: Awaited<ReturnType<typeof getProductsCountByFilters>>['filters']
  updateProductsCount: () => Promise<void>
  totalProducts: number
  subcategories: { doc: Subcategory; count: number }[]
}

export const CategoryHeader: FC<Props> = ({
  category,
  updateProductsCount,
  filters,
  subcategories,
  totalProducts,
  className,
}) => {
  return (
    <section className={clsx('flex flex-col gap-8', className)}>
      <div className='flex flex-col gap-1 tablet:gap-2 laptop:flex-row laptop:items-center laptop:justify-between'>
        <h1 className={clsx('helvetica mb-2 font-light text-gray-900')}>{category.label}</h1>
        <FilterButtons filters={filters} category={category} />
      </div>
      <SubcategoryList
        totalProducts={totalProducts}
        subcategories={subcategories}
        updateProductsCount={updateProductsCount}
      />
    </section>
  )
}
