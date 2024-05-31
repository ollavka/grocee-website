import Skeleton from 'react-loading-skeleton'
import { ReviewsSkeleton } from '.'

export const PoductControlsSkeleton = () => {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4 tablet:gap-10'>
        <div className='order-first flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <div className='tablet:hidden'>
              <Skeleton width={200} height={31} />
            </div>
            <div className='hidden tablet:block'>
              <Skeleton width={200} height={44} />
            </div>
            <Skeleton circle width={40} height={40} />
          </div>
          <Skeleton width={120} height={31} />
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-2'>
            <Skeleton height={31} width={200} />
            <Skeleton height={31} width={100} />
          </div>

          <div className='flex flex-col gap-1'>
            <Skeleton className='block w-full' height={48} borderRadius={1000} />
            <Skeleton className='block w-full' height={48} borderRadius={1000} />
          </div>
        </div>

        <div className='flex flex-col gap-6 tablet:-order-[1]'>
          <Skeleton className='block w-full' height={215} borderRadius={8} />
          <Skeleton className='block w-full' height={215} borderRadius={8} />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <Skeleton width={140} height={31} />
        <Skeleton className='block w-full' height={200} />
      </div>

      <div className='flex flex-col gap-4'>
        <Skeleton width={140} height={31} />

        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <Skeleton height={20} width={100} />
            <Skeleton height={24} width={150} />
          </div>
        </div>
      </div>

      <div className='tablet:hidden'>
        <ReviewsSkeleton />
      </div>
    </div>
  )
}
