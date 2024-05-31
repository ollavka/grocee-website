'use client'

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input, InputProps } from 'ui'
import { useIsSSR } from 'react-aria'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainNavigation } from 'cms-types'
import { clsx } from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useSearchHistory } from 'store'
import mergeRefs from 'merge-refs'

type Props = Pick<MainNavigation['header'], 'search'> &
  Pick<InputProps, 'onFocus' | 'onBlur'> & {
    onStartLoading: () => void
    isStartLoading: boolean
    className?: string
    animationProps?: HTMLMotionProps<'form'>
  }

export const SearchField = forwardRef(
  (
    {
      search,
      isStartLoading,
      onStartLoading,
      onBlur,
      onFocus,
      className = '',
      animationProps,
    }: Props,
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [searchValue, setSearchValue] = useState('')
    const [exitClearButton, setExitClearButton] = useState(false)
    const { history, itemForPush, setItemForPush } = useSearchHistory()

    const isSSR = useIsSSR()

    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('search') ?? ''

    const onSubmit = useCallback(
      (search?: string) => {
        if ((search || searchValue) === query) {
          return
        }

        onStartLoading()

        router.push(`/?search=${search ?? searchValue}`)
      },
      [searchParams, isSSR, searchValue, query],
    )

    useEffect(() => {
      setSearchValue('')
      setItemForPush(null)
    }, [history])

    useEffect(() => {
      if (!itemForPush) {
        return
      }

      setSearchValue(itemForPush)
      onSubmit(itemForPush)
    }, [itemForPush])

    return (
      <motion.form
        className={className}
        role='search'
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
        {...animationProps}
      >
        <Input
          // @ts-ignore
          ref={mergeRefs(inputRef, ref)}
          className='w-full'
          enterKeyHint='search'
          type='text'
          onFocus={onFocus}
          onBlur={onBlur}
          innerClassName={clsx('min-h-[49.6px]', {
            '!py-0 !pr-0': !exitClearButton || searchValue || itemForPush,
          })}
          value={searchValue}
          onChange={event => {
            if (exitClearButton) {
              setExitClearButton(false)
            }
            setSearchValue(event.target.value)
          }}
          leadingComplex={{ start: { icon: 'Search' } }}
          placeholder={search.placeholder}
          aria-label={search.searchButtonLabel}
          trailingComplex={{
            className: '!pl-0 !ml-0',
            end: (
              <AnimatePresence
                onExitComplete={() => {
                  setExitClearButton(true)
                }}
              >
                {(searchValue || isStartLoading) && (
                  <div
                    role='button'
                    className='cursor-pointer'
                    onMouseDown={event => {
                      event.preventDefault()
                      setSearchValue('')
                      setItemForPush(null)
                    }}
                  >
                    <Button
                      aria-label={search.clearSearchButtonLabel}
                      isLoading={isStartLoading}
                      disableBorder
                      standartButton
                      loaderWithoutChildren
                      animationProps={{
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                      }}
                      variant='secondary'
                      className='pointer-events-none'
                    >
                      {search.clearSearchButtonLabel}
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            ),
          }}
        />
      </motion.form>
    )
  },
)
