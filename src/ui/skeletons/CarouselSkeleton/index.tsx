'use client'

import { CarouselBlock } from 'cms-types'
import Skeleton from 'react-loading-skeleton'
import { CardSkeleton, NewsCardSkeleton, ProductCardSkeleton } from '..'
import clsx from 'clsx'

type Props = Pick<CarouselBlock['settings'], 'type'> & {
  disableWithLimit?: boolean
}

export function CarouselSkeleton({ type, disableWithLimit }: Props) {
  const CARDS: Record<
    Props['type'],
    // eslint-disable-next-line no-unused-vars
    (...args: any[]) => JSX.Element | null | Promise<JSX.Element | null>
  > = {
    simpleCard: CardSkeleton,
    productCard: ProductCardSkeleton,
    newsCard: NewsCardSkeleton,
  }

  const SkeletonCard = CARDS[type] || null

  return (
    <div
      className={clsx('flex flex-col gap-6 tablet:gap-8', {
        'width-limit': !disableWithLimit,
      })}
    >
      <div className='flex w-full justify-between gap-6'>
        <Skeleton className='block h-[32px] min-w-[100px] tablet:h-[44px] tablet:min-w-[130px]' />
        <Skeleton className='block h-[32px] min-w-[70px] tablet:h-[44px] tablet:min-w-[170px]' />
      </div>
      <div className='grid grid-cols-1 grid-rows-1 gap-6 overflow-hidden min-[400px]:grid-cols-2 min-[715px]:grid-cols-3 desktop:grid-cols-4'>
        <div className='col-span-1'>
          <SkeletonCard />
        </div>
        <div className='col-span-1 hidden min-[400px]:block'>
          <SkeletonCard />
        </div>
        <div className='col-span-1 hidden h-[250px] min-[715px]:block'>
          <SkeletonCard />
        </div>
        <div className='col-span-1 hidden h-[250px] desktop:block'>
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}
