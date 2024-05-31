'use client'

import { Image as PayloadImageType } from 'cms-types'
import { FC, useMemo } from 'react'
import { HorizontalInfiniteSlider, PayloadImage } from '../..'
import clsx from 'clsx'
import { useWindowSize } from '../../hooks'

type Props = {
  title?: string
  className?: string
  logos: {
    id: string
    logo: PayloadImageType
  }[]
}

export const Cooperation: FC<Props> = ({ title = '', className = '', logos }) => {
  const { isMobile, isTablet } = useWindowSize()

  const slidesGap = useMemo(() => {
    if (isMobile) {
      return 60
    }

    if (isTablet) {
      return 100
    }

    return 140
  }, [isMobile, isTablet])
  return (
    <section className={clsx('flex flex-col gap-8', className)}>
      {title && (
        <h3 className='width-limit helvetica grow justify-start font-light text-gray-900'>
          {title}
        </h3>
      )}

      <div className='min-w-0 bg-gray-25 py-6 laptop:!mx-12 laptop:rounded-[100px] laptop:px-8 desktop:!mx-[100px]'>
        <HorizontalInfiniteSlider gap={slidesGap} pauseOnHover disableTouch>
          {logos.map(({ id, logo }, idx) => (
            <PayloadImage key={`${id}${idx}`} src={logo} className='h-10' />
          ))}
        </HorizontalInfiniteSlider>
      </div>
    </section>
  )
}
