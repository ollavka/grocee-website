import { Fragment, isValidElement } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  BreadcrumbsSkeleton,
  BannerSkeleton,
  HelpBlockSkeleton,
  TagListSkeleton,
  ProductCardSkeleton,
} from 'ui/skeletons'

export default function Loading() {
  const blocks = {
    HelpBlockSkeleton,
    BannerSkeleton,
  }

  return (
    <div className='mt-[120px] tablet:mt-[150px]'>
      <BreadcrumbsSkeleton />

      <div className='width-limit my-8 flex flex-col gap-1 tablet:gap-2 laptop:flex-row laptop:items-center laptop:justify-between'>
        <div>
          <div className='tablet:hidden'>
            <Skeleton width={300} height={32} />
          </div>
          <div className='hidden tablet:block laptop:hidden'>
            <Skeleton width={320} height={40} />
          </div>
          <div className='hidden laptop:block'>
            <Skeleton width={350} height={44} />
          </div>
        </div>
        <div className='flex items-center justify-between tablet:justify-normal tablet:gap-4 laptop:gap-2'>
          <Skeleton width={110} height={48} borderRadius={1000} />
          <Skeleton width={110} height={48} borderRadius={1000} />
        </div>
      </div>

      <div className='width-limit my-8'>
        <TagListSkeleton />
      </div>

      <div className='width-limit grid-layout'>
        {Array.from({ length: 12 }, (_, idx) => (
          <div key={idx} className='col-span-2 laptop:col-span-4 desktop:col-span-3'>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      <div className='mt-8 flex flex-col gap-16 laptop:gap-20'>
        {Object.entries(blocks).map(([blockName, Block]) => {
          const isJSXElement = isValidElement(Block)

          if (isJSXElement) {
            return <Fragment key={blockName}>{Block}</Fragment>
          }

          // @ts-ignore
          return <Block key={blockName} />
        })}
      </div>
    </div>
  )
}
