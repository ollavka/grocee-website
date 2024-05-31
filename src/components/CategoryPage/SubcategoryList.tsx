'use client'

import Link from 'next/link'
import { FC, useEffect, useCallback } from 'react'
import { Tag } from 'ui'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useWindowSize } from 'ui/hooks'
import { useSSR } from '@/hooks'
import { usePathname, useSearchParams } from 'next/navigation'
import { getSearchWith } from 'ui/helpers'
import { useGlobalTypography } from '@/store'
import { TagListSkeleton } from 'ui/skeletons'
import { Subcategory } from 'cms-types'

type Props = {
  totalProducts: number
  subcategories: { doc: Subcategory; count: number }[]
  updateProductsCount: () => Promise<void>
}

export const SubcategoryList: FC<Props> = ({
  subcategories,
  totalProducts,
  updateProductsCount,
}) => {
  const { isMobile, isTablet } = useWindowSize()
  const { isServer } = useSSR()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const { categoryPage } = useGlobalTypography()

  const subcategoryParam = searchParams.get('subcat') || null

  const handleUpdateSubcategory = useCallback(
    (newSubcategory: string | null) => {
      const params = getSearchWith(searchParams, { subcat: newSubcategory, page: '1' })

      if (!params) {
        return pathname
      }

      const mappedParams = params.split('&').reduce(
        (acc, param) => {
          const [key, value] = param.split('=')

          if (!(key in acc)) {
            //@ts-ignore
            acc[key] = value
          }

          return acc
        },
        {} as Record<string, string>,
      )

      return {
        query: mappedParams,
      }
    },
    [searchParams, pathname],
  )

  if (isServer) {
    return <TagListSkeleton />
  }

  if (isMobile || isTablet) {
    return (
      <SubcategoriesSlider
        totalProducts={totalProducts}
        subcategories={subcategories}
        updateProductsCount={updateProductsCount}
        handleUpdateSubcategory={handleUpdateSubcategory}
        selectedSubcategory={subcategoryParam}
      />
    )
  }

  return (
    <div className='flex flex-wrap gap-2'>
      <Link href={handleUpdateSubcategory(null)} className='inline-block no-underline'>
        <Tag
          type={!subcategoryParam || subcategoryParam === 'all' ? 'selected' : 'bordered'}
          className='!py-1 tablet:!py-2'
        >
          {`${categoryPage.allSubcategoriesFilterLabel} (${totalProducts})`}
        </Tag>
      </Link>
      {subcategories.map(({ doc, count }) => {
        if (count <= 0) {
          return null
        }

        const { id, label, slug } = doc

        return (
          <Link key={id} href={handleUpdateSubcategory(slug)} className='inline-block no-underline'>
            <Tag
              type={subcategoryParam === slug ? 'selected' : 'bordered'}
              className='!py-1 tablet:!py-2'
            >
              {`${label} (${count})`}
            </Tag>
          </Link>
        )
      })}
    </div>
  )
}

function SubcategoriesSlider({
  selectedSubcategory,
  handleUpdateSubcategory,
  subcategories,
  totalProducts,
}: Props & {
  selectedSubcategory: string | null
  handleUpdateSubcategory: (subcat: string | null) => string | { query: Record<string, string> }
}) {
  const { categoryPage } = useGlobalTypography()

  return (
    <Swiper slidesPerView='auto' spaceBetween={8} className='!mx-0'>
      <>
        <SwiperSlide className='inline-block max-w-fit'>
          <Link href={handleUpdateSubcategory(null)} className='inline-block no-underline'>
            <Tag
              type={!selectedSubcategory || selectedSubcategory === 'all' ? 'selected' : 'bordered'}
              className='!py-1 tablet:!py-2'
            >
              {`${categoryPage.allSubcategoriesFilterLabel} (${totalProducts})`}
            </Tag>
          </Link>
        </SwiperSlide>
        {subcategories.map(({ doc, count }) => {
          if (count <= 0) {
            return null
          }

          const { id, label, slug } = doc

          return (
            <SwiperSlide key={id} className='inline-block max-w-fit'>
              <Link href={handleUpdateSubcategory(slug)} className='inline-block no-underline'>
                <Tag
                  type={selectedSubcategory === slug ? 'selected' : 'bordered'}
                  className='!py-1 tablet:!py-2'
                >
                  {`${label} (${count})`}
                </Tag>
              </Link>
            </SwiperSlide>
          )
        })}
      </>
    </Swiper>
  )
}
