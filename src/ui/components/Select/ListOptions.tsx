'use client'

import { useLayoutEffect, useCallback, useEffect, useRef, MutableRefObject, useState } from 'react'
import { SelectState, Node as StatelyNode } from 'react-stately'
import { FocusScope, useListBox, useOverlay, mergeProps } from 'react-aria'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SelectOption } from './SelectOption'
import { SelectProps } from '.'
import { Swap, swapDirection } from './swapDirection'
import clsx from 'clsx'

type ListOptionsProps<T> = {
  selectState: SelectState<unknown>
  isDismissable?: boolean
  triggerRef: MutableRefObject<HTMLButtonElement | null>
} & Pick<
  SelectProps<T>,
  'onChange' | 'animationOrigin' | 'listPosition' | 'listWidth' | 'maxHeight' | 'label'
>

type ListPosition<T> = {
  vertical: 'top' | 'bottom'
  horizontal: 'left' | 'right'
  height: 'auto' | number
  width: 'auto' | number
  origin: NonNullable<SelectProps<T>['animationOrigin']>
  triggerHeight?: number
}

type UpdatePosition<T> = Partial<Omit<ListPosition<T>, 'origin'>> & {
  replace: {
    horizontal?: Swap<T, 'horizontal'>
    vertical?: Swap<T, 'vertical'>
  }
}

export function ListOptions<T>({
  selectState,
  onChange,
  animationOrigin = 'top left',
  listPosition = {
    horizontal: 'left',
    vertical: 'top',
  },
  listWidth,
  maxHeight,
  isDismissable = true,
  triggerRef,
  label,
  ...restProps
}: ListOptionsProps<T>) {
  const [position, setPosition] = useState<ListPosition<T>>({
    vertical: listPosition.vertical!,
    horizontal: listPosition.horizontal!,
    width: listWidth || 'auto',
    height: 'auto',
    origin: animationOrigin,
  })

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const listBoxRef = useRef<HTMLUListElement | null>(null)

  const { ref: inViewRef, entry } = useInView()

  const { listBoxProps } = useListBox(
    {
      autoFocus: false,
      'aria-label': label.listOptions,
    },
    selectState,
    listBoxRef,
  )

  const { overlayProps } = useOverlay(
    {
      isOpen: selectState.isOpen,
      shouldCloseOnBlur: true,
      onClose: selectState.close,
      isDismissable,
    },
    overlayRef,
  )

  const setOverlayRefs = useCallback(
    (node: any) => {
      overlayRef.current = node
      inViewRef(node)
    },
    [inViewRef, overlayRef],
  )

  const updatePosition = useCallback((args: UpdatePosition<T>) => {
    const { replace, ...newPosition } = args

    setPosition(prev => ({
      ...prev,
      ...newPosition,
      origin: swapDirection(prev.origin, replace?.horizontal, replace?.vertical),
    }))
  }, [])

  const checkDropdownPosition = useCallback(() => {
    if (entry && triggerRef.current) {
      const selectRect = entry.boundingClientRect
      const buttonRect = triggerRef.current.getBoundingClientRect()

      const topButtonOffset = buttonRect.top
      const bottomButtonOffset = document.documentElement.clientHeight - buttonRect.bottom

      const leftFullButtonOffset = buttonRect.right
      const rightFullButtonOffset = document.documentElement.clientWidth - buttonRect.left

      const selectHeight = selectRect.bottom - selectRect.top + selectRect.height - 16
      const selectWidth = selectRect.right - selectRect.left + selectRect.width
      const buttonHeight = buttonRect.height

      if (position.vertical === 'top') {
        if (bottomButtonOffset > topButtonOffset && topButtonOffset < selectHeight + 24) {
          updatePosition({
            vertical: 'bottom',
            height: Math.min(selectHeight, bottomButtonOffset - 24),
            replace: {
              vertical: {
                from: 'bottom',
                to: 'top',
              },
            },
            triggerHeight: buttonHeight,
          })
        } else {
          updatePosition({
            vertical: 'top',
            height: Math.min(selectHeight, topButtonOffset - 24),
            replace: {
              vertical: {
                from: 'top',
                to: 'bottom',
              },
            },
            triggerHeight: buttonHeight,
          })
        }
      } else if (position.vertical === 'bottom') {
        if (bottomButtonOffset < topButtonOffset && bottomButtonOffset < selectHeight + 24) {
          updatePosition({
            vertical: 'top',
            height: Math.min(selectHeight, topButtonOffset - 24),
            replace: {
              vertical: {
                from: 'top',
                to: 'bottom',
              },
            },
            triggerHeight: buttonHeight,
          })
        } else {
          updatePosition({
            vertical: 'bottom',
            height: Math.min(selectHeight, bottomButtonOffset - 24),
            replace: {
              vertical: {
                from: 'bottom',
                to: 'top',
              },
            },
            triggerHeight: buttonHeight,
          })
        }
      }

      if (position.horizontal === 'left') {
        if (
          leftFullButtonOffset < rightFullButtonOffset &&
          leftFullButtonOffset < selectWidth + 12
        ) {
          updatePosition({
            horizontal: 'right',
            replace: {
              horizontal: {
                from: 'right',
                to: 'left',
              },
            },
            width: Math.min(selectWidth, rightFullButtonOffset - 24),
            triggerHeight: buttonHeight,
          })
        } else {
          updatePosition({
            horizontal: 'left',
            replace: {
              horizontal: {
                from: 'left',
                to: 'right',
              },
            },
            width: Math.min(selectWidth, leftFullButtonOffset - 24),
            triggerHeight: buttonHeight,
          })
        }
      } else if (position.horizontal === 'right') {
        if (
          leftFullButtonOffset > rightFullButtonOffset &&
          rightFullButtonOffset < selectWidth + 12
        ) {
          updatePosition({
            horizontal: 'left',
            replace: {
              horizontal: {
                from: 'left',
                to: 'right',
              },
            },
            width: Math.min(selectWidth, leftFullButtonOffset - 24),
            triggerHeight: buttonHeight,
          })
        } else {
          updatePosition({
            horizontal: 'right',
            replace: {
              horizontal: {
                from: 'right',
                to: 'left',
              },
            },
            width: Math.min(selectWidth, rightFullButtonOffset - 24),
            triggerHeight: buttonHeight,
          })
        }
      }
    }
  }, [entry, triggerRef.current])

  useEffect(() => {
    if (triggerRef.current) {
      updatePosition({
        vertical: position.vertical!,
        height: position.height,
        replace: {},
        width: position.width,
        horizontal: position.horizontal,
        triggerHeight: triggerRef.current!.getBoundingClientRect().height,
      })
    }
  }, [triggerRef.current])

  useLayoutEffect(() => {
    if (selectState.isOpen && entry && triggerRef.current) {
      checkDropdownPosition()

      window.addEventListener('scroll', checkDropdownPosition)
      window.addEventListener('resize', checkDropdownPosition)
    } else {
      window.removeEventListener('scroll', checkDropdownPosition)
      window.removeEventListener('resize', checkDropdownPosition)
    }

    return () => {
      window.removeEventListener('scroll', checkDropdownPosition)
      window.removeEventListener('resize', checkDropdownPosition)
    }
  }, [selectState.isOpen, entry, triggerRef.current])

  return (
    <FocusScope restoreFocus>
      {/*@ts-ignore */}
      <motion.div
        {...overlayProps}
        ref={setOverlayRefs}
        key='list-overlay'
        className={clsx('absolute z-50', {
          'pt-2': position.vertical === 'bottom',
          'pb-2': position.vertical === 'top',
        })}
        style={{
          transformOrigin: position.origin,
          [position.horizontal! === 'left' ? 'right' : 'left']: 0,
          bottom: position.vertical === 'top' ? position.triggerHeight : undefined,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
      >
        <div className='mx-[-4px] overflow-hidden rounded-2xl bg-white p-1 shadow-[0_4px_16px_0_rgba(105,105,105,0.24)]'>
          <ul
            ref={listBoxRef}
            {...mergeProps(restProps, listBoxProps)}
            className='flex flex-col gap-2 overflow-auto bg-white p-6 outline-none'
            style={{ maxHeight, height: position.height, width: position.width }}
          >
            {[...Array.from(selectState.collection)].map(option => (
              <SelectOption
                key={option.key}
                option={option as StatelyNode<T>}
                selectState={selectState}
                onChange={onChange}
                label={label.option}
              />
            ))}
          </ul>
        </div>
      </motion.div>
    </FocusScope>
  )
}
