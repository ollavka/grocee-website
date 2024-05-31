'use client'

import { FC, useRef, useCallback } from 'react'
import { getFilteredProducts } from '@/cms'
import { useGlobalTypography, useShoppingBasket } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useCookies } from 'next-client-cookies'
import { useSearchParams } from 'next/navigation'
import { Button, Pagination, ProductCard } from 'ui'
import { mapCMSProducts } from '@/helpers/mapCMSProducts'
import { ProductCardSkeleton } from 'ui/skeletons'
import toast from 'react-hot-toast'
import { MappedProduct } from 'ui/types'

type Props = {
  categoryId: string
}

export const ProductList: FC<Props> = ({ categoryId }) => {
  const searchParams = useSearchParams()
  const { categoryPage, cart } = useGlobalTypography()

  const locale = useCookies().get('locale') || 'en'

  const subcategory = searchParams.get('subcat') || null
  const tags = searchParams.get('tags') || null
  const trademarks = searchParams.get('trademarks') || null
  const countries = searchParams.get('countries') || null
  const specials = searchParams.get('specials') || null

  const minPrice = searchParams.get('minPrice') || null
  const maxPrice = searchParams.get('maxPrice') || null

  const sort = searchParams.get('sort') || null
  const order = searchParams.get('order') || 'asc'

  const page = searchParams.get('page') || '1'

  const cachedTotalPagesCount = useRef(0)

  const { lineItems, addLineItem } = useShoppingBasket()

  const onAddToCartClick = useCallback(
    (product: MappedProduct) => {
      addLineItem(product)
      toast.success(cart.addToCartSuccess)
    },
    [lineItems, cart],
  )

  const {
    data: products,
    isError,
    error,
    isPending,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      const filterParams = {
        categoryId,
        subcategorySlug: subcategory,
        tags,
        specials,
        countries,
        trademarks,
        minPrice,
        maxPrice,
      } as Record<string, string | string[]>

      const sortParams = {
        sort,
        order,
      } as Record<string, string | string[]>

      const { docs, totalPages } = await getFilteredProducts({
        filterParams,
        sortParams,
        locale,
        page,
      })
      const products = await mapCMSProducts(docs, locale)

      cachedTotalPagesCount.current = totalPages

      return products
    },
    queryKey: ['filteredProducts', categoryId, searchParams.toString()],
  })

  if (isError) {
    return (
      <div className='flex flex-col gap-4'>
        <h1 className='helvetica font-light text-error-600'>
          {categoryPage.errorMessage || error.message}
        </h1>
        <Button href='/' className='!max-w-fit' standartButton variant='secondary'>
          {categoryPage.backToHomePageLabel}
        </Button>
      </div>
    )
  }

  if (isPending || isFetching || isLoading) {
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

  return (
    <>
      <div className='grid-layout'>
        {products.map((product, idx) => (
          <ProductCard
            key={`${product.id}-${idx}`}
            product={product}
            onAddToCartClick={onAddToCartClick}
            className='col-span-2 !p-2 laptop:col-span-4 laptop:!p-4 desktop:col-span-3'
          />
        ))}
      </div>
      {(cachedTotalPagesCount.current ?? 0) > 1 && (
        <Pagination
          className='mt-4 laptop:mt-8'
          page={+page}
          totalPages={cachedTotalPagesCount.current ?? 0}
        />
      )}
    </>
  )
}
