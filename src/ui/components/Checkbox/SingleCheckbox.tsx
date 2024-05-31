/* eslint-disable no-unused-vars */
'use client'
import { FC, PropsWithChildren, useRef } from 'react'
import { useToggleState } from 'react-stately'
import { VisuallyHidden, mergeProps, useCheckbox, useFocusRing } from 'react-aria'
import { AnimatedCheckbox } from './AnimatedCheckbox'
import clsx from 'clsx'

type CheckboxProps = PropsWithChildren & {
  label: string
  isDisabled?: boolean
  className?: string
  isSelected?: boolean
  onChange?: (value: boolean) => void
}

export const Checkbox: FC<CheckboxProps> = ({ children, className = '', ...restProps }) => {
  const state = useToggleState(restProps)

  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const { inputProps, labelProps, ...restCheckboxProps } = useCheckbox(
    { ...restProps, 'aria-label': restProps.label },
    state,
    checkboxRef,
  )
  const { focusProps, isFocusVisible } = useFocusRing()

  const isDisabled = restCheckboxProps.isDisabled || restProps?.isDisabled
  const isChecked = state.isSelected

  return (
    <label
      {...labelProps}
      className={clsx(
        'gilroy-sm flex max-w-fit select-none items-center gap-2',
        {
          'pointer-events-none opacity-50': isDisabled,
        },
        className,
      )}
    >
      <VisuallyHidden>
        <input
          {...mergeProps(inputProps, focusProps)}
          ref={checkboxRef}
          className='pointer-events-none'
        />
      </VisuallyHidden>

      <AnimatedCheckbox isChecked={isChecked} isFocusVisible={isFocusVisible} />
      {children}
    </label>
  )
}
