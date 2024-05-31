'use client'

import { PropsWithChildren, useEffect, useMemo } from 'react'
import { ButtonProps } from '.'
import { parseIcon } from 'ui/helpers/parseIcon'
import { motion, useAnimate } from 'framer-motion'

type Props<T> = PropsWithChildren &
  Pick<ButtonProps<T>, 'leftIcon' | 'rightIcon'> & {
    className?: string
  }

function Icon<T>({ icon }: { icon?: Props<T>['leftIcon'] }) {
  const { icon: MappedIcon, animateWhen, animationProps, value } = parseIcon(icon)
  const [scope, animate] = useAnimate()

  const { width, height } = useMemo(() => {
    let width = 16
    let height = 24

    if (icon?.size && typeof icon.size === 'number') {
      width = icon.size
      height = icon.size

      return {
        width,
        height,
      }
    }

    // @ts-ignore
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (icon?.size && 'width' in icon?.size) {
      // @ts-ignore
      width = icon.size?.width
    }

    // @ts-ignore
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (icon?.size && 'height' in icon?.size) {
      // @ts-ignore
      height = icon.size?.height
    }

    return {
      width,
      height,
    }
  }, [icon])

  useEffect(() => {
    if (!animateWhen || !MappedIcon) {
      return
    }

    if (animateWhen(value)) {
      animate(scope.current, animationProps?.initial ?? {}, animationProps?.transition ?? {})
    } else {
      animate(scope.current, animationProps?.exit ?? {}, animationProps?.transition ?? {})
    }
  }, [animateWhen, value, animationProps])

  if (!MappedIcon) {
    return null
  }

  return (
    <motion.div ref={scope}>
      <MappedIcon height={height} width={width} />
    </motion.div>
  )
}

export function IconsWrapper<T>({ children, leftIcon, rightIcon, className = '' }: Props<T>) {
  return (
    <div className={className}>
      <Icon icon={leftIcon} />
      {children}
      <Icon icon={rightIcon} />
    </div>
  )
}
