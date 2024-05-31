'use client'

import 'swiper/css'
import 'swiper/css/effect-fade'

import { FC, useCallback, useMemo, useState } from 'react'
import { Swiper, SwiperProps, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Image as PayloadImageType } from 'cms-types'
import { clsx } from 'clsx'
import { PayloadImage, Button, ButtonProps } from 'ui'
import { useWindowSize } from '../../hooks'

export type SlideProps = {
  id: string
  image: PayloadImageType
  heading?: {
    title?: string | null
    description?: string | null
    link?: {
      props?: ButtonProps<string>
      text?: string
    }
  }
}

export type SliderProps = Pick<SwiperProps, 'autoplay' | 'loop' | 'speed' | 'effect'> & {
  className?: string
  slides: SlideProps[]
  slideClassName?: string
  swiperClassName?: string
}

export const MainSlider: FC<SliderProps> = ({
  className = '',
  slideClassName = '',
  slides,
  swiperClassName = '',
  ...props
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const { windowSize } = useWindowSize()

  const [disabledNavigation, setDisabledNavigation] = useState<{ prev: boolean; next: boolean }>({
    prev: true,
    next: true,
  })

  const onUpdateDisableNavigation = useCallback(
    ({ isBeginning, isEnd }: Pick<SwiperType, 'isBeginning' | 'isEnd'>) => {
      const prev = isBeginning && (!swiper?.originalParams?.loop || windowSize.width <= 1024)
      const next = isEnd && (!swiper?.originalParams?.loop || windowSize.width <= 1024)

      setDisabledNavigation(prevState => ({
        ...prevState,
        prev,
        next,
      }))
    },
    [swiper],
  )

  return (
    <section className={className} role='slider'>
      <Swiper
        modules={[Autoplay, EffectFade]}
        centeredSlides
        spaceBetween={20}
        allowTouchMove
        autoHeight
        breakpoints={{
          1024: {
            loop: false,
          },
          1280: {
            allowTouchMove: false,
          },
        }}
        onSwiper={swiper => {
          setSwiper(swiper)
          onUpdateDisableNavigation({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd })
        }}
        onSlideChange={onUpdateDisableNavigation}
        onResize={({ isBeginning, isEnd, originalParams }) => {
          const currPrev = isBeginning && originalParams.loop
          const currNext = isEnd && originalParams.loop

          if (currPrev !== disabledNavigation.prev || currNext !== disabledNavigation.next) {
            onUpdateDisableNavigation({ isBeginning, isEnd })
          }
        }}
        className={clsx('relative rounded-b-[32px] laptop:rounded-[32px]', swiperClassName)}
        {...props}
      >
        {slides.map(({ id, ...slide }, idx) => {
          return (
            <SwiperSlide key={id} virtualIndex={idx}>
              <Slide {...slide} slideClassName={slideClassName} />
            </SwiperSlide>
          )
        })}

        <div className='absolute bottom-8 right-1/2 z-20 flex translate-x-1/2 gap-2 tablet:right-[68px] tablet:translate-x-0'>
          <PrevSlide isDisabled={disabledNavigation.prev} speed={props?.speed ?? 500} />
          <NextSlide isDisabled={disabledNavigation.next} speed={props?.speed ?? 500} />
        </div>
      </Swiper>
    </section>
  )
}

function Slide({
  heading,
  slideClassName = '',
  image,
}: Omit<SlideProps, 'id'> & { slideClassName?: string }) {
  const { isVisible } = useSwiperSlide()

  const tabIndex = useMemo(() => (isVisible ? 0 : -1), [isVisible])

  return (
    <div className={clsx('h-[702px] tablet:h-[656px]', slideClassName)} tabIndex={tabIndex}>
      <div>
        <PayloadImage
          src={image}
          className='!static h-full w-full'
          skipBlur
          imgProps={{
            className: clsx(
              'absolute left-0 top-0 z-10 h-full w-full rounded-b-[32px] object-cover laptop:rounded-[32px]',
            ),
          }}
        />

        {heading && (
          <div
            className={clsx(
              'relative z-20 mx-4 mb-[88px] mt-72 flex max-w-[496px] flex-col gap-8 rounded-[32px] bg-gray-25 p-8 min-[528px]:mx-auto',
              'tablet:absolute tablet:bottom-8 tablet:left-[68px] tablet:m-0',
            )}
          >
            <div className='flex flex-col gap-2'>
              {heading.title && (
                <h3 className='helvetica-xs font-light text-gray-900 tablet:text-[32px] tablet:leading-[125%]'>
                  {heading.title}
                </h3>
              )}
              {heading.description && (
                <p className='gilroy-sm line-clamp-3 text-gray-700'>{heading.description}</p>
              )}
            </div>

            {heading.link && (
              <Button {...heading.link.props} tabIndex={tabIndex}>
                <span className='flex grow justify-start'>{heading.link.text}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function NextSlide({ isDisabled = false, speed }: { isDisabled?: boolean; speed: number }) {
  const swiper = useSwiper()

  return (
    <Button
      onClick={() => {
        swiper.slideNext(speed)
      }}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowRight', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}

function PrevSlide({ isDisabled = false, speed }: { isDisabled?: boolean; speed: number }) {
  const swiper = useSwiper()

  return (
    <Button
      onClick={() => {
        swiper.slidePrev(speed)
      }}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowLeft', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}
