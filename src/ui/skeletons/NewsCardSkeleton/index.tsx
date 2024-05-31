'use client'

import Skeleton from 'react-loading-skeleton'
import { useWindowSize } from '../../hooks'

export function NewsCardSkeleton() {
  const { isLaptop, isDesktop } = useWindowSize()

  const height = isLaptop || isDesktop ? 439 : 364

  return <Skeleton className='block h-full w-full' height={height} borderRadius={16} />
}
