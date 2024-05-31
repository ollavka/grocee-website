'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useEdgeBlocksOnPage, useGlobalTypography, usePrevPath, useShoppingBasket } from '@/store'
import { Pagination, ProductCard as ProductCardUI } from 'ui'
import { useSearchParams } from 'next/navigation'
import { SearchPageSkeleton } from './SearchPageSkeleton'
import { mapIcon } from '@oleksii-lavka/grocee-icons'
import { FocusRing } from 'react-aria'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import { MappedProduct } from 'ui/types'
import toast from 'react-hot-toast'

type Props = {
  query: string
  fetchProducts: (page?: number) => Promise<{
    products: MappedProduct[]
    totalDocs: number
    totalPages: number
  }>
}

export function SearchPage({ query, fetchProducts }: Props) {
  const cachedTotalPagesCount = useRef(0)
  const cachedTotalProductsCount = useRef(0)

  const [startPageChange, setStartPageChange] = useState(false)
  const { updateBlock } = useEdgeBlocksOnPage()
  const searchParams = useSearchParams()
  const { searchPage, backButton, cart } = useGlobalTypography()
  const { prevPath } = usePrevPath()

  const { lineItems, addLineItem } = useShoppingBasket()

  const onAddToCartClick = useCallback(
    (product: MappedProduct) => {
      addLineItem(product)
      toast.success(cart.addToCartSuccess)
    },
    [lineItems, cart],
  )

  const page = +(searchParams.get('page') || 1)

  const {
    data: products,
    isError,
    error,
    isLoading,
    isFetching,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ['products', query, page],
    queryFn: async () => {
      const { products, totalDocs, totalPages } = await fetchProducts(page)

      cachedTotalPagesCount.current = totalPages
      cachedTotalProductsCount.current = totalDocs

      return products
    },
  })

  const { searchResultTitle, productsCountTitle, emptySearchResultTitle, errorSearchResultTitle } =
    useMemo(() => {
      const searchResultTitle = searchPage.searchResultTitle.replace('{{query}}', query)
      const emptySearchResultTitle = searchPage.emptySearchResultTitle.replace('{{query}}', query)
      const errorSearchResultTitle = searchPage.errorSearchResultTitle
      const productsCountTitle = searchPage.productsCountTitle.replace(
        '{{count}}',
        `${cachedTotalProductsCount.current ?? 0}`,
      )

      return {
        searchResultTitle,
        productsCountTitle,
        emptySearchResultTitle,
        errorSearchResultTitle,
      }
    }, [searchPage, query, products])

  const mappedBackButton = useMemo(() => {
    if (!backButton.icon.icon) {
      return null
    }

    const Icon = mapIcon(backButton.icon.icon)

    if (!Icon) {
      return null
    }

    return (
      <FocusRing focusRingClass='ring ring-offset-2'>
        <Link
          href={prevPath ?? '/'}
          className='gilroy-md tablet:[text-20px] my-4 inline-flex items-center gap-2 border-none bg-transparent font-light text-gray-900 no-underline outline-none'
        >
          <Icon width={backButton.icon.size.width} height={backButton.icon.size.height} />
          <span>{backButton.label}</span>
        </Link>
      </FocusRing>
    )
  }, [backButton])

  useEffect(() => {
    updateBlock({ firstBlockOnPage: null, lastBlockOnPage: null })
  }, [])

  useEffect(() => {
    setStartPageChange(false)
  }, [page])

  if (isError) {
    return (
      <div className='width-limit mt-[120px] tablet:mt-[150px]'>
        <h1 className='helvetica font-light text-error-600'>
          {errorSearchResultTitle || error.message}
        </h1>
        {mappedBackButton && mappedBackButton}
      </div>
    )
  }

  return (
    <div className='width-limit mt-[120px] tablet:mt-[150px]'>
      {!mappedBackButton ||
      !emptySearchResultTitle ||
      !searchResultTitle ||
      !productsCountTitle ||
      isFetching ||
      isLoading ||
      isPending ||
      isRefetching ? (
        <>
          <div className='mr-4 w-3/4 tablet:hidden'>
            <Skeleton height={44} />
          </div>
          <div className='hidden tablet:block'>
            <Skeleton width={500} height={44} />
          </div>
          <Skeleton width={61} height={24} className='mb-8 mt-4' />
        </>
      ) : (
        <>
          <h1 className='helvetica font-light text-gray-900'>
            {cachedTotalProductsCount.current > 0
              ? `${searchResultTitle} (${productsCountTitle})`
              : emptySearchResultTitle}
          </h1>

          {mappedBackButton && mappedBackButton}
        </>
      )}

      {isLoading || isPending || isFetching || startPageChange ? (
        <div className='mt-6 tablet:mt-8'>
          <SearchPageSkeleton />
        </div>
      ) : (
        <>
          <div className='grid-layout mt-6 tablet:mt-8'>
            {products?.map((product, idx) => (
              <ProductCardUI
                className='col-span-2 !p-2 laptop:col-span-4 laptop:!p-4 desktop:col-span-3'
                key={`${product.id}-${idx}`}
                product={product}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </>
      )}
      {(cachedTotalPagesCount.current ?? 0) > 1 && (
        <Pagination
          className='mt-4 laptop:mt-8'
          page={page}
          totalPages={cachedTotalPagesCount.current ?? 0}
        />
      )}
    </div>
  )
}
