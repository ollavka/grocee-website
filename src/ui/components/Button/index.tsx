/* eslint-disable no-unused-vars */
'use client'

import {
  PropsWithChildren,
  useMemo,
  useEffect,
  useRef,
  MouseEventHandler,
  KeyboardEventHandler,
  MutableRefObject,
  CSSProperties,
  InputHTMLAttributes,
} from 'react'
import { AllIconNames, IconType } from '@oleksii-lavka/grocee-icons'
import { FocusRing, HoverEvents, mergeProps, useButton, useHover, useLink } from 'react-aria'
import { AnimationProps, HTMLMotionProps, ValueAnimationTransition, motion } from 'framer-motion'
import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { IconsWrapper } from './IconsWrapper'
import { Loader } from 'ui'

export type IconProps<T> = {
  icon?: AllIconNames | IconType | null
  animationProps?: Pick<AnimationProps, 'initial' | 'exit'> & {
    transition?: ValueAnimationTransition<any>
  }
  animateWhen?: (value?: T) => boolean
  value?: T
}

export type ButtonProps<T> = PropsWithChildren<{
  additionalRef?: MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>
  className?: string
  leftIcon?: IconProps<T> & {
    size?:
      | {
          width?: number
          height?: number
        }
      | number
  }
  rightIcon?: IconProps<T> & {
    size?:
      | {
          width?: number
          height?: number
        }
      | number
  }
  isLoading?: boolean
  loaderWithoutChildren?: boolean
  isDisabled?: boolean
  href?: LinkProps['href']
  target?: '_self' | '_blank' | '_parent' | '_top'
  prefetch?: boolean
  standartButton?: boolean
  animationProps?: HTMLMotionProps<'div' | 'button'>
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'defaultLink'
  type?: 'button' | 'submit' | 'reset' | 'form-button'
  tabIndex?: number
  isFocused?: boolean
  style?: CSSProperties
  backgroundColor?: string
  disableBorder?: boolean
  linkClassName?: string
  contentClassName?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  formAction?: (formData: FormData) => void
  onHoverStart?: HoverEvents['onHoverStart']
  onHoverEnd?: HoverEvents['onHoverEnd']
  onKeyPress?: KeyboardEventHandler<HTMLButtonElement | null>
  onMouseEnter?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | null>
}> &
  Pick<InputHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-controls' | 'aria-expanded'>

export function Button<T>(props: ButtonProps<T>) {
  const {
    variant = 'primary',
    leftIcon,
    rightIcon,
    children,
    href,
    type = 'button',
    backgroundColor,
    formAction,
    isLoading,
    className = '',
    linkClassName = '',
    contentClassName = '',
    isFocused,
    style,
    disableBorder,
    standartButton,
    onHoverStart = () => {},
    onHoverEnd = () => {},
    onMouseEnter = () => {},
    onKeyPress = () => {},
    additionalRef,
    prefetch,
    loaderWithoutChildren,
    tabIndex,
    ...restProps
  } = props
  const { isDisabled, onClick, animationProps } = restProps

  const refButton = useRef<HTMLButtonElement | null>(null)
  const refLink = useRef<HTMLAnchorElement | null>(null)

  const { hoverProps } = useHover({ onHoverStart, onHoverEnd })

  const isButtonDisabled = isDisabled || isLoading

  const { buttonProps, isPressed: isButtonPressed } = useButton(
    {
      ...restProps,
      // @ts-ignore
      onPress: onClick,
      type: type === 'form-button' ? 'submit' : type,
      isDisabled: isButtonDisabled,
    },
    refButton,
  )
  const { linkProps, isPressed: isLinkPressed } = useLink(
    {
      ...restProps,
      // @ts-ignore
      onPress: onClick,
    },
    refLink,
  )

  useEffect(() => {
    if (!additionalRef || !('current' in additionalRef)) {
      return
    }

    if (!href && (!refButton || !('current' in refButton))) {
      return
    }

    if (href && (!refLink || !('current' in refLink))) {
      return
    }

    additionalRef.current = refButton.current
  }, [additionalRef?.current, refButton.current, refLink.current, href])

  const isPressed = isButtonPressed || isLinkPressed || isFocused

  const parentProps = useMemo(
    () => ({
      className: clsx(
        {
          'relative block touch-none select-none rounded-[1000px] border-transparent text-center font-light no-underline transition-colors duration-300 ease-in-out':
            variant !== 'defaultLink',
          'after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded-[1000px] after:transition-colors after:duration-300 after:content-[""]':
            variant !== 'defaultLink',
        },
        {
          'after:border-[1px]': !disableBorder && variant !== 'defaultLink',
          'gilroy-md min-h-12 px-6 py-3': standartButton && variant !== 'defaultLink',
        },
        {
          'cursor-pointer': !isDisabled,
          'cursor-not-allowed': isDisabled,
        },
        {
          primary: clsx({
            'text-white': !isButtonDisabled,
            'after:border-transparent': !isPressed,
            'bg-gray-900 hover:bg-gray-800': !isPressed && !isButtonDisabled,
            'bg-gray-900 after:border-gray-800': isPressed && !isButtonDisabled,
            'bg-gray-200 text-gray-500': isButtonDisabled,
          }),
          secondary: clsx('bg-transparent', {
            'text-gray-800 after:border-gray-800 hover:text-gray-700 hover:after:border-gray-700':
              !isPressed && !isButtonDisabled,
            'text-gray-900 after:border-gray-900': isPressed && !isButtonDisabled,
            'text-gray-300 after:border-gray-300': isButtonDisabled,
          }),
          tertiary: clsx('bg-gray-25 hover:after:border-gray-800', {
            'after:border-gray-800': isPressed && !isButtonDisabled,
            'bg-gray-25 text-gray-200': isButtonDisabled,
            'after:border-transparent': !isPressed,
            'text-gray-900': !isButtonDisabled,
          }),
          danger: clsx('bg-transparent', {
            'text-error-700 after:border-error-700': isPressed && !isButtonDisabled,
            'text-error-500 after:border-error-500 hover:text-error-600 hover:after:border-error-600':
              !isPressed && !isButtonDisabled,
            'text-gray-500 after:border-gray-500': isButtonDisabled,
          }),
          defaultLink:
            'gilroy-sm ease inline-block text-gray-900 underline underline-offset-2 transition-colors duration-300 hover:text-gray-700',
        }[variant],
        className,
      ),
      ...animationProps,
    }),
    [variant, isPressed, isButtonDisabled],
  )

  const content = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center gap-2'>
          {!loaderWithoutChildren && children}
          <Loader size={20} />
        </div>
      )
    }

    if (variant !== 'defaultLink') {
      return (
        <IconsWrapper
          className={clsx('flex items-center justify-center gap-2', contentClassName)}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {children}
        </IconsWrapper>
      )
    }

    return children
  }

  if (href) {
    return (
      <FocusRing focusRingClass='ring ring-offset-2'>
        <Link
          ref={refLink}
          {...mergeProps(linkProps, hoverProps)}
          onClick={onClick}
          className={clsx('rounded-[1000px]', linkClassName)}
          href={href}
          prefetch={prefetch}
          tabIndex={tabIndex}
        >
          {/* @ts-ignore */}
          <motion.div {...parentProps}>{content()}</motion.div>
        </Link>
      </FocusRing>
    )
  }

  // eslint-disable-next-line no-unused-vars
  const { onClick: onButtonClick, onPointerDown, onPointerUp, ...restButtonProps } = buttonProps

  return (
    <FocusRing focusRingClass='ring ring-offset-2'>
      {/* @ts-ignore */}
      <motion.button
        ref={refButton}
        {...mergeProps(restButtonProps, parentProps, hoverProps)}
        style={style}
        onPointerDown={event => {
          if (event.button !== 0 || type === 'form-button') {
            return
          }

          onPointerDown && onPointerDown(event)
        }}
        onPointerUp={event => {
          if (event.button !== 0 || type === 'form-button') {
            return
          }

          onPointerUp && onPointerUp(event)
          isButtonPressed && event.currentTarget.click()
        }}
        onKeyPress={onKeyPress}
        //@ts-ignore
        formAction={formAction}
        aria-label='button'
        aria-disabled={isDisabled || isLoading}
        tabIndex={tabIndex}
      >
        {content()}
      </motion.button>
    </FocusRing>
  )
}
