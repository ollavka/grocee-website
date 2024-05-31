'use client'

import Skeleton from 'react-loading-skeleton'

export function CooperationSkeleton() {
  return (
    <>
      <div className='hidden laptop:mx-12 laptop:block desktop:mx-[100px]'>
        <Skeleton className='w-full' height={88} borderRadius={100} />
      </div>
      <div className='laptop:hidden'>
        <Skeleton className='w-full' height={88} />
      </div>
    </>
  )
}
