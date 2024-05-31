'use client'

import Skeleton from 'react-loading-skeleton'
import { AccordionSkeleton } from '..'

export function HelpBlockSkeleton() {
  return (
    <div className='width-limit flex grid-cols-12 flex-col gap-8 laptop:grid laptop:gap-x-8 laptop:gap-y-6'>
      <div className='flex grow flex-col gap-6 tablet:gap-8 laptop:col-span-6'>
        <Skeleton height={44} width={185} />

        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4'>
            <Skeleton width={48} height={48} borderRadius={1000} />

            <div className='flex flex-col gap-1'>
              <Skeleton width={110} height={20} />
              <Skeleton width={78} height={18} />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Skeleton width={48} height={48} borderRadius={1000} />

            <div className='flex flex-col gap-1'>
              <Skeleton width={110} height={20} />
              <Skeleton width={78} height={18} />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Skeleton width={48} height={48} borderRadius={1000} />

            <div className='flex flex-col gap-1'>
              <Skeleton width={110} height={20} />
              <Skeleton width={78} height={18} />
            </div>
          </div>
        </div>

        <Skeleton width={140} height={48} borderRadius={1000} />
      </div>

      <div className='laptop:col-span-6'>
        <AccordionSkeleton disableWidthLimit />
      </div>
    </div>
  )
}
