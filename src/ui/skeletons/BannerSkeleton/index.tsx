'use client'

import Skeleton from 'react-loading-skeleton'

export function BannerSkeleton() {
  return (
    <>
      <div className='hidden laptop:mx-12 laptop:block desktop:mx-[100px]'>
        <Skeleton className='w-full' height={650} borderRadius={32} />
      </div>
      <div className='laptop:hidden'>
        <Skeleton className='w-full' height={650} />
      </div>
    </>
  )
}
