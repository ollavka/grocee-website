'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { MainSlider as MainSliderUI, SliderProps } from 'ui'

export const MainSliderClient: FC<SliderProps> = props => {
  const pathname = usePathname()

  return (
    <MainSliderUI
      {...props}
      className={clsx({ 'laptop:px-8': pathname === '/', 'width-limit': pathname !== '/' })}
      swiperClassName={clsx({
        '!rounded-t-[32px]': pathname !== '/',
      })}
    />
  )
}
