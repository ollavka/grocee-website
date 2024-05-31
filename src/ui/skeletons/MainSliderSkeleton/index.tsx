'use client'

import Skeleton from 'react-loading-skeleton'

export function MainSliderSkeleton() {
  return (
    <>
      <div className='-mt-2.5 hidden h-[712px] min-h-[712px] tablet:h-[666px] tablet:min-h-[666px] laptop:block laptop:px-8'>
        <Skeleton className='h-full w-full' borderRadius={32} />
      </div>
      <div className='-mt-2.5 h-[712px] min-h-[712px] tablet:h-[666px] tablet:min-h-[666px] laptop:hidden laptop:px-8'>
        <Skeleton className='h-full w-full' />
      </div>
    </>
  )
}
