'use client'

import { useGlobalTypography } from '@/store'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { type BannerProps, Banner as BannerUI } from 'ui'
import { WithSkeletonLoader } from 'ui/hoc'
import { BannerSkeleton } from 'ui/skeletons'

export const BannerClient: FC<BannerProps> = WithSkeletonLoader(
  ({ heading, ...props }: BannerProps) => {
    const { orderDeliveryForm } = useGlobalTypography()

    const pathname = usePathname()

    return (
      // @ts-ignore
      <BannerUI
        {...props}
        // @ts-ignore
        heading={{ ...heading, orderDeliveryFormTypography: orderDeliveryForm }}
        className={clsx({
          'laptop:mx-12 laptop:rounded-[32px] desktop:mx-[100px]': pathname === '/',
          'width-limit rounded-[32px]': pathname !== '/',
        })}
      />
    )
  },
  BannerSkeleton,
)
