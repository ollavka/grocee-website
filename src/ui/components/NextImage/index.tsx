'use client'

import { FC } from 'react'
import NextBaseImage, { ImageProps } from 'next/image'

export const NextImage: FC<ImageProps> = (props: ImageProps) => {
  return (
    <NextBaseImage
      {...props}
      loader={({ src }) => {
        return src
      }}
    />
  )
}
