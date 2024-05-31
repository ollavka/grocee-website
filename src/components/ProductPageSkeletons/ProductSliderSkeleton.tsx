import Skeleton from 'react-loading-skeleton'

export const ProductSliderSkeleton = () => {
  return (
    <div>
      <Skeleton
        className='block h-[262px] w-full tablet:h-[500px] laptop:h-[600px] desktop:h-[700px]'
        borderRadius={32}
      />
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex gap-2 tablet:hidden'>
          <Skeleton width={40} height={40} borderRadius={8} />
          <Skeleton width={40} height={40} borderRadius={8} />
          <Skeleton width={40} height={40} borderRadius={8} />
        </div>
        <div className='hidden gap-2 tablet:flex'>
          <Skeleton width={64} height={64} borderRadius={8} />
          <Skeleton width={64} height={64} borderRadius={8} />
          <Skeleton width={64} height={64} borderRadius={8} />
        </div>
        <div className='flex gap-1'>
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
        </div>
      </div>
    </div>
  )
}
