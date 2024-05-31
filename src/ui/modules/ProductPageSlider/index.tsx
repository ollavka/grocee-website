'use client'

import 'swiper/css/thumbs'
import 'swiper/css/zoom'

import type { Image as PayloadImageType } from 'cms-types'
import { FC, useCallback, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Button, PayloadImage } from '../..'
import type { Swiper as SwiperType } from 'swiper'
import { Thumbs, Zoom } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductSliderSkeleton } from '@/components/ProductPageSkeletons'
import { WithSkeletonLoader } from '../../hoc'
import { Search } from '@oleksii-lavka/grocee-icons/icons'

type Props = {
  className?: string
  productGallery: {
    id: string
    image: PayloadImageType
  }[]
}

export const ProductPageSlider: FC<Props> = WithSkeletonLoader(
  ({ productGallery, className = '' }: Props) => {
    const [swiper, setSwiper] = useState<SwiperType | null>(null)
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const [activeSlide, setActiveSlide] = useState(0)

    const [disabledNavigation, setDisabledNavigation] = useState<{ prev: boolean; next: boolean }>({
      prev: true,
      next: true,
    })

    const onUpdateDisableNavigation = useCallback(
      ({ isBeginning, isEnd }: Pick<SwiperType, 'isBeginning' | 'isEnd'>) => {
        setDisabledNavigation(prevState => ({
          ...prevState,
          prev: isBeginning,
          next: isEnd,
        }))
      },
      [swiper],
    )

    const onSwipeToNextSlide = useCallback(() => {
      if (!swiper) {
        return () => {}
      }

      return swiper.slideNext(500)
    }, [swiper])

    const onSwipeToPrevSlide = useCallback(() => {
      if (!swiper) {
        return () => {}
      }

      return swiper.slidePrev(500)
    }, [swiper])

    const toggleZoomSlide = useCallback(() => {
      swiper?.zoom.toggle()
    }, [swiper])

    return (
      <section className={className}>
        <Swiper
          modules={[Thumbs, Zoom]}
          zoom={{
            minRatio: 1,
            maxRatio: 2,
            toggle: false,
          }}
          onSlideChange={swiper => {
            onUpdateDisableNavigation(swiper)
            setActiveSlide(swiper.activeIndex)
          }}
          onSwiper={swiper => {
            setSwiper(swiper)
            onUpdateDisableNavigation({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd })
          }}
          speed={500}
          spaceBetween={24}
          slidesPerGroup={1}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          wrapperClass='relative'
        >
          {productGallery.map(({ id, image }) => (
            <SwiperSlide key={id} className='rounded-[32px] bg-gray-50 mix-blend-multiply'>
              <div className='swiper-zoom-container relative w-full pb-[262px] mix-blend-multiply tablet:pb-[500px] laptop:pb-[600px] desktop:pb-[700px]'>
                <PayloadImage
                  src={image}
                  skipBlur
                  className='absolute left-0 top-0 h-full w-full object-contain mix-blend-multiply'
                  imgProps={{
                    className: 'w-full h-full left-0 top-0 object-contain mix-blend-multiply',
                  }}
                />
              </div>
            </SwiperSlide>
          ))}

          <Button
            variant='secondary'
            style={{ zIndex: 3 }}
            className='!absolute bottom-[26px] right-[33px] !hidden p-3 laptop:!block'
            onClick={toggleZoomSlide}
          >
            <Search size={24} className='p-[3px]' />
          </Button>
        </Swiper>
        <div className='mt-4 flex items-center justify-between gap-4'>
          <div className='!min-w-0'>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              watchSlidesProgress
              slidesPerView={3}
              style={{ marginLeft: 0 }}
              className='max-w-[150px] tablet:max-w-[220px]'
            >
              {productGallery.map(({ id, image }, idx) => (
                <SwiperSlide key={id} className='relative cursor-pointer mix-blend-exclusion'>
                  <div className='relative h-10 w-10 overflow-hidden tablet:h-16 tablet:w-16'>
                    <PayloadImage
                      src={image}
                      skipBlur
                      imgProps={{
                        className: 'absolute left-0 top-0 w-full object-contain mix-blend-multiply',
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {idx === activeSlide && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='absolute inset-0 max-w-10 rounded border-[1px] border-gray-900 tablet:max-w-16'
                      />
                    )}
                  </AnimatePresence>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className='flex gap-2'>
            <PrevSlide onSwipe={onSwipeToPrevSlide} isDisabled={disabledNavigation.prev} />
            <NextSlide onSwipe={onSwipeToNextSlide} isDisabled={disabledNavigation.next} />
          </div>
        </div>
      </section>
    )
  },
  ProductSliderSkeleton,
)

function NextSlide({ isDisabled, onSwipe }: { isDisabled?: boolean; onSwipe: () => void }) {
  return (
    <Button
      onClick={onSwipe}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowRight', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}

function PrevSlide({ isDisabled, onSwipe }: { isDisabled?: boolean; onSwipe: () => void }) {
  return (
    <Button
      onClick={onSwipe}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowLeft', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}
