import Skeleton from 'react-loading-skeleton'
import { BreadcrumbsSkeleton, CarouselSkeleton } from 'ui/skeletons'

export default function Loading() {
  return (
    <div className='mb-[200px] mt-[120px] tablet:mt-[150px]'>
      <BreadcrumbsSkeleton />

      <div className='width-limit mt-8 flex grow flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <Skeleton width={65} height={40} />
          <Skeleton width={180} height={32} borderRadius={1000} />
        </div>

        <div className='grid-layout !gap-y-10'>
          <div className='col-span-full tablet:col-span-3 laptop:col-span-6'>
            <div className='flex flex-col gap-4'>
              <Skeleton count={3} borderRadius={8} className='!block w-full' height={64} />
            </div>
          </div>

          <div className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'>
            <Skeleton className='!block w-full' height={400} borderRadius={8} />
          </div>
        </div>

        <CarouselSkeleton disableWithLimit type='productCard' />
      </div>
    </div>
  )
}
