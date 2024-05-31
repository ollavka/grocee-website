import {
  ProductSliderSkeleton,
  PoductControlsSkeleton,
  ReviewsSkeleton,
} from '@/components/ProductPageSkeletons'
import { BreadcrumbsSkeleton, CarouselSkeleton } from 'ui/skeletons'

export default function Loading() {
  return (
    <div className='flex flex-col gap-16 laptop:gap-20'>
      <div className='mt-[120px] flex flex-col gap-8 tablet:mt-[150px]'>
        <BreadcrumbsSkeleton />

        <div className='grid-layout width-limit'>
          <div className='col-span-full tablet:col-span-3 laptop:col-span-7'>
            <div className='grid grid-cols-7 gap-8'>
              <div className='col-span-full laptop:col-span-6'>
                <ProductSliderSkeleton />
              </div>
            </div>

            <div className='!hidden tablet:!grid'>
              <ReviewsSkeleton />
            </div>
          </div>
          <div className='col-span-full tablet:col-span-3 laptop:col-start-8 laptop:col-end-13'>
            <PoductControlsSkeleton />
          </div>
        </div>
      </div>

      <div className='mt-10 laptop:mt-20'>
        <CarouselSkeleton type='productCard' />
      </div>
    </div>
  )
}
