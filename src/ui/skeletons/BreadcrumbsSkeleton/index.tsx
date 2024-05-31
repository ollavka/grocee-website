'use client'

import clsx from 'clsx'
import Skeleton from 'react-loading-skeleton'

type Props = {
  disableWithLimit?: boolean
}

export function BreadcrumbsSkeleton({ disableWithLimit = false }: Props) {
  return (
    <div className={clsx({ 'width-limit': !disableWithLimit })}>
      <div className='w-3/5'>
        <Skeleton height={24} className='w-full' />
      </div>
    </div>
  )
}
