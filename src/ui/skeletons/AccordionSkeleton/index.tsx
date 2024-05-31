'use client'

import Skeleton from 'react-loading-skeleton'
import clsx from 'clsx'

type Props = {
  disableWidthLimit?: boolean
}

export function AccordionSkeleton({ disableWidthLimit }: Props) {
  return (
    <div
      className={clsx('flex flex-col gap-8', {
        'width-limit': !disableWidthLimit,
      })}
    >
      <div className='flex justify-between gap-4'>
        <div className='w-3/5'>
          <Skeleton className='block w-full' height={48} />
        </div>
        <Skeleton className='h-ful block' width={48} height={48} borderRadius={1000} />
      </div>
      <div className='flex justify-between gap-4'>
        <div className='w-3/5'>
          <Skeleton className='block w-full' height={48} />
        </div>
        <Skeleton className='h-ful block' width={48} height={48} borderRadius={1000} />
      </div>
      <div className='flex justify-between gap-4'>
        <div className='w-3/5'>
          <Skeleton className='block w-full' height={48} />
        </div>
        <Skeleton className='h-ful block' width={48} height={48} borderRadius={1000} />
      </div>
      <div className='flex justify-between gap-4'>
        <div className='w-3/5'>
          <Skeleton className='block w-full' height={48} />
        </div>
        <Skeleton className='h-ful block' width={48} height={48} borderRadius={1000} />
      </div>
      <div className='flex justify-between gap-4'>
        <div className='w-3/5'>
          <Skeleton className='block w-full' height={48} />
        </div>
        <Skeleton className='h-ful block' width={48} height={48} borderRadius={1000} />
      </div>
    </div>
  )
}
