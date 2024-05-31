/* eslint-disable no-unused-vars */
import { IconType, mapIcon } from '@oleksii-lavka/grocee-icons'
import { IconProps } from 'ui/components/Button'
import { AnimationProps, ValueAnimationTransition } from 'framer-motion'

export function parseIcon<T>(icon?: IconProps<T>): {
  icon: IconType | null
  animationProps?: Pick<AnimationProps, 'initial' | 'exit'> & {
    transition?: ValueAnimationTransition<any>
  }
  animateWhen?: (value?: T) => boolean
  value?: T
} {
  if (!icon || !icon?.icon) {
    return {
      icon: null,
      animateWhen: () => false,
      animationProps: {
        initial: {},
        exit: {},
        transition: {},
      },
    }
  }

  if (typeof icon === 'string') {
    return {
      icon: mapIcon(icon),
      animateWhen: () => false,
      animationProps: {
        initial: {},
        exit: {},
        transition: {},
      },
    }
  }

  if ('icon' in icon) {
    return {
      icon: typeof icon.icon === 'string' ? mapIcon(icon.icon) : (icon.icon as IconType),
      animationProps: icon?.animationProps,
      animateWhen: icon?.animateWhen,
      value: icon?.value,
    }
  }

  return {
    icon: icon as IconType,
    animateWhen: () => false,
    animationProps: {
      initial: {},
      exit: {},
      transition: {},
    },
  }
}
