import Skeleton from 'react-loading-skeleton'
import { BreadcrumbsSkeleton } from 'ui/skeletons'
import { clsx } from 'clsx'

type Props = {
  isClient?: boolean
}

export default function Loading({ isClient = false }: Props) {
  return (
    <div className={clsx('mb-[200px]', { 'mt-[120px] tablet:mt-[150px]': !isClient })}>
      <BreadcrumbsSkeleton disableWithLimit={isClient} />

      <div
        className={clsx('grid-layout mt-8 !gap-8', {
          'width-limit': !isClient,
        })}
      >
        <div className='col-span-full flex flex-col gap-8 laptop:col-span-4'>
          <Skeleton width={200} height={40} borderRadius={8} />
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
        </div>
        <div className='col-span-full laptop:col-start-5 laptop:col-end-13'>
          <div className='flex flex-col gap-6 laptop:gap-10'>
            <Skeleton width={150} height={30} borderRadius={8} />

            <div className='flex flex-col gap-4 laptop:flex-row'>
              <div className='w-full grow'>
                <Skeleton className='!block w-full' height={48} borderRadius={1000} />
              </div>
              <div className='w-full grow'>
                <Skeleton className='!block w-full' height={48} borderRadius={1000} />
              </div>
            </div>

            <div className='w-full grow'>
              <Skeleton className='!block w-full' height={48} borderRadius={1000} />
            </div>

            <div className='w-full grow'>
              <Skeleton className='!block w-full' height={150} borderRadius={8} />
            </div>

            <div className='w-full grow laptop:w-[180px] laptop:self-end'>
              <Skeleton className='!block w-full' height={48} borderRadius={1000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
