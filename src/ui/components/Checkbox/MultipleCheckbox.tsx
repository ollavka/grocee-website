/* eslint-disable no-unused-vars */
'use client'

import { useRef, useContext, createContext, PropsWithChildren, FC } from 'react'
import {
  useFocusRing,
  VisuallyHidden,
  mergeProps,
  useCheckboxGroupItem,
  useCheckboxGroup,
} from 'react-aria'
import { useCheckboxGroupState, CheckboxGroupState } from 'react-stately'
import clsx from 'clsx'
import { Show } from 'ui'
import { AnimatedCheckbox } from './AnimatedCheckbox'

const CheckboxContext = createContext<CheckboxGroupState>({} as CheckboxGroupState)

type CheckboxProps = PropsWithChildren & {
  label: string
  isDisabled?: boolean
  value: string
  className?: string
}

type CheckboxGroupComponent = FC<
  PropsWithChildren & {
    label: string
    disableLabel?: boolean
    isDisabled?: boolean
    defaultValue?: string[]
    value?: string[]
    onChange?: (value: string[]) => void
    name?: string
    className?: string
    labelClassName?: string
  }
> & {
  Item: FC<CheckboxProps>
}

export const CheckboxGroup: CheckboxGroupComponent = ({
  disableLabel = false,
  children,
  className = '',
  labelClassName = '',
  ...restProps
}) => {
  const { label } = restProps

  const state = useCheckboxGroupState(restProps)

  const { groupProps, labelProps } = useCheckboxGroup(restProps, state)

  return (
    <div {...groupProps} className={className}>
      <Show>
        <Show.When isTrue={!disableLabel}>
          <span {...labelProps} className={labelClassName}>
            {label}
          </span>
        </Show.When>
      </Show>

      <CheckboxContext.Provider value={state}>{children}</CheckboxContext.Provider>
    </div>
  )
}

const Checkbox: FC<CheckboxProps> = ({ children, className = '', ...restProps }) => {
  const state = useContext(CheckboxContext)
  const checkboxRef = useRef<HTMLInputElement | null>(null)

  const { inputProps, labelProps } = useCheckboxGroupItem(
    { ...restProps, 'aria-label': restProps.label },
    state,
    checkboxRef,
  )
  const { focusProps, isFocusVisible } = useFocusRing()

  const isDisabled = state.isDisabled || restProps?.isDisabled
  const isChecked = state.isSelected(restProps?.value)

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

CheckboxGroup.Item = Checkbox
