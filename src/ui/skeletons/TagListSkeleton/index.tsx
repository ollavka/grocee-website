'use client'

import Skeleton from 'react-loading-skeleton'

export function TagListSkeleton() {
  return (
    <div className='overflow-hidden'>
      <div className='flex gap-2 overflow-hidden laptop:flex-wrap'>
        <Skeleton height={36} width={52} borderRadius={1000} />
        <Skeleton height={36} width={77} borderRadius={1000} />
        <Skeleton height={36} width={114} borderRadius={1000} />
        <Skeleton height={36} width={75} borderRadius={1000} />
        <Skeleton height={36} width={72} borderRadius={1000} />
        <Skeleton height={36} width={244} borderRadius={1000} />
      </div>
    </div>
  )
}
