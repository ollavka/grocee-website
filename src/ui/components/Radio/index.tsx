/* eslint-disable no-unused-vars */
'use client'

import { useRef, useContext, createContext, PropsWithChildren, FC } from 'react'
import { useFocusRing, VisuallyHidden, useRadioGroup, useRadio, mergeProps } from 'react-aria'
import { useRadioGroupState, RadioGroupState } from 'react-stately'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { Show } from 'ui'

const RadioContext = createContext<RadioGroupState>({} as RadioGroupState)

type RadioProps = PropsWithChildren & {
  label: string
  isDisabled?: boolean
  value: string
  className?: string
}

type RadioGroupComponent = FC<
  PropsWithChildren & {
    label: string
    disableLabel?: boolean
    isDisabled?: boolean
    defaultValue?: string
    onChange?: (value: string) => void
    name?: string
    className?: string
    labelClassName?: string
  }
> & {
  Item: FC<RadioProps>
}

export const RadioGroup: RadioGroupComponent = ({
  disableLabel = false,
  children,
  className = '',
  labelClassName = '',
  ...restProps
}) => {
  const { label } = restProps

  const state = useRadioGroupState(restProps)

  const { radioGroupProps, labelProps } = useRadioGroup(restProps, state)

  return (
    <div {...radioGroupProps} className={className}>
      <Show>
        <Show.When isTrue={!disableLabel}>
          <span {...labelProps} className={labelClassName}>
            {label}
          </span>
        </Show.When>
      </Show>

      <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
    </div>
  )
}

const Radio: FC<RadioProps> = ({ children, className = '', ...restProps }) => {
  const state = useContext(RadioContext)
  const radioRef = useRef<HTMLInputElement | null>(null)

  const { inputProps, isSelected, isDisabled, labelProps } = useRadio(
    { ...restProps, 'aria-label': restProps.label },
    state,
    radioRef,
  )
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <label
      {...labelProps}
      className={clsx(
        'gilroy-md flex max-w-fit select-none items-center gap-2 font-light',
        {
          'pointer-events-none opacity-50': isDisabled,
        },
        className,
      )}
    >
      <VisuallyHidden>
        <input
          {...mergeProps(inputProps, focusProps)}
          ref={radioRef}
          className='pointer-events-none'
        />
      </VisuallyHidden>

      <div
        className={clsx(
          'ml-[-4px] inline-block min-h-[18px] min-w-[18px] rounded-[1000px] border-2 p-[2px]',
          {
            'border-focus': isFocusVisible,
            'border-transparent': !isFocusVisible,
          },
        )}
      >
        <div
          className={clsx(
            'relative flex h-[18px] w-[18px] items-center justify-center rounded-[1000px] bg-transparent p-[5px] outline-gray-800',
            'after:absolute after:left-0 after:top-0 after:block after:h-full after:w-full after:rounded-[1000px] after:border-[1px] after:transition-colors after:duration-300 after:content-[""]',
            {
              'after:border-gray-900': isSelected,
              'after:border-gray-700': !isSelected,
            },
          )}
          role='radio'
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className='h-full w-full rounded-[1000px] bg-gray-900'
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      {children}
    </label>
  )
}

RadioGroup.Item = Radio
