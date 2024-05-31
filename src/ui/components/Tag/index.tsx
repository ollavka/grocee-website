'use client'

import { FC, PropsWithChildren } from 'react'
import clsx from 'clsx'
import { motion, HTMLMotionProps } from 'framer-motion'

export type TagProps = PropsWithChildren & {
  text?: string
  className?: string
  type?: 'texted' | 'bordered' | 'selected'
  animationProps?: HTMLMotionProps<'div'>
  onClick?: () => void
}

export const Tag: FC<TagProps> = ({
  type = 'selected',
  children,
  className,
  animationProps,
  text,
  onClick,
}) => {
  return (
    <motion.div
      className={clsx(
        'gilroy-md relative inline-block rounded-[1000px] px-3 py-2 font-light transition-colors duration-300 ease-in-out',
        'after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded-[1000px] after:border-[1px] after:border-transparent after:transition-colors after:duration-300 after:content-[""]',
        {
          texted: 'bg-transparent text-gray-900',
          bordered: 'bg-transparent text-gray-900 after:!border-gray-700',
          selected: 'bg-gray-900 text-white',
        }[type],
        className,
      )}
      onClick={onClick}
      {...animationProps}
    >
      {children || text}
    </motion.div>
  )
}
