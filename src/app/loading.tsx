import { Fragment, isValidElement } from 'react'
import {
  MainSliderSkeleton,
  CarouselSkeleton,
  BannerSkeleton,
  CooperationSkeleton,
  HelpBlockSkeleton,
} from 'ui/skeletons'

export default function Loading() {
  const blocks = {
    MainSliderSkeleton,
    CarouselSkeletonCard: <CarouselSkeleton type='simpleCard' />,
    CarouselSkeletonProductCard: <CarouselSkeleton type='productCard' />,
    BannerSkeleton,
    CooperationSkeleton,
    HelpBlockSkeleton,
  }

  return (
    <div className='flex flex-col gap-16 laptop:gap-20'>
      {Object.entries(blocks).map(([blockName, Block]) => {
        const isJSXElement = isValidElement(Block)

        if (isJSXElement) {
          return <Fragment key={blockName}>{Block}</Fragment>
        }

        // @ts-ignore
        return <Block key={blockName} />
      })}
    </div>
  )
}
