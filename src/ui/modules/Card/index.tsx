'use client'

import { CSSProperties, FC, useRef } from 'react'
import { ArrowRight } from '@oleksii-lavka/grocee-icons/icons'
import Link from 'next/link'
import clsx from 'clsx'
import { Image as PayloadImageType } from 'cms-types'
import { FocusRing, useHover, useLink } from 'react-aria'
import { PayloadImage } from 'ui'
import { useCanHover } from '../../hooks'

type CardProps = {
  className?: string
  imageClassName?: string
  imageContainerClassName?: string
  imageContainerStyle?: CSSProperties
  image?: PayloadImageType
  text: string
  href: string
  gap?: 'small' | 'big'
}

export const Card: FC<CardProps> = props => {
  const {
    className = '',
    href,
    text,
    gap = 'small',
    image,
    imageClassName = '',
    imageContainerClassName = '',
    imageContainerStyle,
  } = props
  const canHover = useCanHover()

  const { hoverProps, isHovered } = useHover({})
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const { linkProps } = useLink(props, linkRef)

  return (
    <FocusRing focusRingClass='ring ring-offset-2'>
      <Link
        href={href}
        className={clsx(
          'relative flex flex-col rounded-lg bg-gray-25 p-4',
          {
            'gap-4': gap === 'small',
            'gap-[62px]': gap === 'big',
          },
          className,
        )}
        {...linkProps}
        {...hoverProps}
        ref={linkRef}
      >
        <div
          className={clsx(
            'relative min-h-24 grow overflow-hidden rounded-lg',
            imageContainerClassName,
          )}
          style={imageContainerStyle}
        >
          <PayloadImage
            src={image}
            skipBlur
            imgProps={{
              className: clsx(
                'absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300',
                { 'scale-110': canHover && isHovered },
                imageClassName,
              ),
            }}
          />
        </div>

        <div className='gilroy-md flex items-center justify-between gap-1 text-gray-900'>
          <span>{text}</span>
          <ArrowRight
            className={clsx('transition-transform duration-300', {
              'translate-x-1': canHover && isHovered,
            })}
          />
        </div>
      </Link>
    </FocusRing>
  )
}
