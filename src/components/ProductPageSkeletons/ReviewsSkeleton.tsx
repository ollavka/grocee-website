import Skeleton from 'react-loading-skeleton'

export const ReviewsSkeleton = () => {
  return (
    <div className='mt-8 flex flex-col gap-6 tablet:mt-16'>
      <div className='flex flex-col gap-2'>
        <Skeleton width={140} height={31} />
        <Skeleton width={200} height={24} />
      </div>

      <div className='flex flex-col gap-2 laptop:hidden'>
        <Skeleton borderRadius={4} height={200} className='block w-full' />
        <Skeleton borderRadius={4} height={200} className='block w-full' />
        <Skeleton borderRadius={4} height={200} className='block w-full' />
        <Skeleton borderRadius={4} height={200} className='block w-full' />
      </div>

      <div className='hidden grid-cols-2 gap-8 laptop:grid'>
        <Skeleton borderRadius={4} height={200} className='col-span-1' />
        <Skeleton borderRadius={4} height={200} className='col-span-1' />
        <Skeleton borderRadius={4} height={200} className='col-span-1' />
        <Skeleton borderRadius={4} height={200} className='col-span-1' />
      </div>

      <div className='mt-6 flex flex-col items-center gap-4 tablet:mt-8 tablet:flex-row-reverse tablet:justify-between'>
        <div className='flex gap-1'>
          <Skeleton width={40} height={40} circle />
          <Skeleton width={40} height={40} circle />
        </div>
        <div className='h-12 w-full tablet:w-[260px]'>
          <Skeleton className='block w-full tablet:w-[260px]' height={48} borderRadius={1000} />
        </div>
      </div>
    </div>
  )
}
