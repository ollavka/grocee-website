'use client'

import { FC } from 'react'
import { Image as PayloadImageType } from 'cms-types'
import clsx from 'clsx'
import { Tag, Button, PayloadImage } from 'ui'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useCanHover } from '../../hooks'
import { useHover } from 'react-aria'

type Props = {
  tag: string | null
  image?: PayloadImageType
  title: string
  titleColor?: 'white' | 'black'
  minWidth?: number
  link: {
    url: string
    label: string
  }
  imageClassName?: string
  className?: string
  animationProps?: HTMLMotionProps<'div'>
}

export const NewsCard: FC<Props> = props => {
  const {
    title,
    link,
    tag,
    titleColor = 'white',
    imageClassName = '',
    className = '',
    minWidth,
    animationProps = {},
    image,
  } = props

  const canHover = useCanHover()
  const { hoverProps, isHovered } = useHover({})

  return (
    //@ts-ignore
    <motion.div
      className={clsx('relative h-[364px] rounded-2xl laptop:h-[439px]', className)}
      style={{
        minWidth,
      }}
      {...animationProps}
      {...hoverProps}
    >
      <div
        className='absolute left-0 top-0 z-10 h-full w-full rounded-2xl'
        style={{
          background:
            'linear-gradient(0deg, rgba(32, 32, 32, 0.00) 55.99%, #999 263.93%, #202020 263.93%), linear-gradient(180deg, rgba(32, 32, 32, 0.00) 55.99%, #999 263.93%, #202020 263.93%)',
        }}
      />

      <div className='absolute h-full w-full overflow-hidden rounded-2xl'>
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

      <div className='relative z-10 flex h-full flex-col justify-between gap-4 p-4'>
        {tag && (
          <div>
            <Tag text={tag} />
          </div>
        )}

        <div className='flex grow flex-col justify-end'>
          <h3 className='gilroy-xl mb-4' style={{ color: titleColor }}>
            {title}
          </h3>

          <Button
            href={link.url}
            standartButton
            variant='tertiary'
            className='!inline-block'
            linkClassName='max-w-fit'
          >
            {link.label}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
