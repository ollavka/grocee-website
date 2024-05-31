'use client'

import { useCallback, useRef } from 'react'
import { FocusRing, useOption } from 'react-aria'
import { SelectState, Node as StatelyNode } from 'react-stately'
import { SelectProps } from '.'
import clsx from 'clsx'

export type SelectOptionType<T> = {
  label: T
  value: T
}

type OptionProps<T> = {
  selectState: SelectState<unknown>
  option: StatelyNode<T>
  label: string
} & Pick<SelectProps<T>, 'onChange'>

export function SelectOption<T>({ selectState, option, onChange, label }: OptionProps<T>) {
  const optionRef = useRef<HTMLLIElement | null>(null)

  const isSelectedValue = selectState.selectedKey === option.key

  const { optionProps } = useOption(
    { key: option.key, 'aria-label': label },
    selectState,
    optionRef,
  )

  const onChangeOption = useCallback(() => {
    if (selectState.selectedKey === option.key) {
      return
    }

    onChange?.({
      label: option.textValue as T,
      value: option.key as T,
    })

    selectState.setSelectedKey(option.key)
    optionRef.current?.blur()
  }, [selectState.selectedKey, option])

  return (
    <FocusRing focusRingClass='ring ring-offset-2'>
      <li
        ref={optionRef}
        {...optionProps}
        aria-selected={isSelectedValue}
        onClick={onChangeOption}
        onKeyDown={event => {
          if (event.key !== 'Enter') {
            return
          }

          onChangeOption()
        }}
        onPointerDown={undefined}
        onPointerUp={undefined}
        className={clsx(
          'ease gilroy-sm cursor-pointer select-none rounded-lg px-3 py-2 text-gray-900 outline-none transition-colors duration-300 first-letter:uppercase hover:bg-gray-50',
          {
            'bg-gray-100': isSelectedValue,
            'bg-transparent': !isSelectedValue,
          },
        )}
      >
        {`${option.rendered}`}
      </li>
    </FocusRing>
  )
}
