'use client'

import { FC, useRef, useCallback, useMemo, useEffect, useState } from 'react'
import { Button, CheckboxGroup, Input, Loader } from 'ui'
import { FilterProps, ModalFilters, Props } from '.'
import { useSSR } from '@/hooks'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import modalService from 'ui/service/modalService'
import { useWindowSize } from 'ui/hooks'
import { useEdgeBlocksOnPage } from '@/store'
import { useOnClickOutside } from 'usehooks-ts'
import { FocusRing } from 'react-aria'
import { Close } from '@oleksii-lavka/grocee-icons/icons'
import clsx from 'clsx'

export const DesktopFilter: FC<Omit<FilterProps, 'filters'> & Props> = ({
  filterTypography,
  onChangeFilterModalOpened,
  isOpen,
  filterOptions,
  selectedFilterOption,
  onChangeSelectedFilterOption,
  handelUpdateFilters,
  tempFilters,
  selectedFilters,
  startChangingFilters,
  searchParamsUpdating,
  updatedFilters,
  handelUpdateFilterParams,
  isPending,
  isTheSameParams,
  choosenFilters,
  paramsIsApplied,
  onChangeParamsApplied,
  onChangeTempFilters,
}) => {
  const { label: buttonLabel, applyFilterButtonLabel, filterLabels } = filterTypography
  const { isServer } = useSSR()
  const body = useRef<Element | null>(null)
  const asideRef = useRef<HTMLElement | null>(null)

  const { isMobile, isTablet, isLaptop, isDesktop, windowSize } = useWindowSize()
  const { firstBlockOnPage } = useEdgeBlocksOnPage()

  const headerOffsetRight = useMemo(() => {
    if (isMobile) {
      return 16
    }

    if (isTablet) {
      return 20
    }

    if (firstBlockOnPage === 'Banner' || firstBlockOnPage === 'MainSlider') {
      if (isLaptop) {
        return 48
      }

      return 100
    }

    return 32
  }, [isMobile, isTablet, isLaptop, isDesktop, firstBlockOnPage])

  const handleOpenSidebarFilters = useCallback(() => {
    onChangeFilterModalOpened(true)

    modalService.changeModalState('sideBar', true, {
      fade: 'full',
      headerOffsetRight,
    })
  }, [headerOffsetRight])

  const handleCloseSidebarFilters = useCallback(() => {
    onChangeFilterModalOpened(false)
    onChangeSelectedFilterOption(null)

    modalService.changeModalState('sideBar', false)
  }, [])

  useEffect(() => {
    modalService.addActionOnScreenChange('sideBar', {
      onCloseDesktop: () => {
        handleCloseSidebarFilters()
      },
      onCloseMobile: () => {
        handleCloseSidebarFilters()
      },
    })
  }, [])

  useOnClickOutside(asideRef, handleCloseSidebarFilters)

  useEffect(() => {
    body.current = document.body
  }, [])

  useEffect(() => {
    if (paramsIsApplied) {
      handleCloseSidebarFilters()
      onChangeParamsApplied(false)
    }
  }, [paramsIsApplied])

  if (isServer || !body.current) {
    return null
  }

  return (
    <>
      <Button
        variant='tertiary'
        onClick={handleOpenSidebarFilters}
        standartButton
        rightIcon={{ icon: 'Filter' }}
      >
        {buttonLabel}
      </Button>
      {createPortal(
        <motion.aside
          ref={asideRef}
          aria-label='filter-sidebar'
          animate={isOpen ? 'opened' : 'closed'}
          initial='closed'
          transition={{
            type: 'spring',
            duration: 0.7,
          }}
          variants={{
            opened: {
              opacity: 1,
              scaleX: 1,
              pointerEvents: 'all',
            },
            closed: {
              opacity: 0,
              scaleX: 0,
              pointerEvents: 'none',
            },
          }}
          className='fixed bottom-0 left-0 top-0 z-30 flex w-[400px] origin-left flex-col overflow-y-auto overflow-x-hidden bg-white p-4'
        >
          <header className='mb-6 flex justify-between'>
            <h2 className='gilroy-lg relative grow text-gray-900'>{buttonLabel}</h2>

            <FocusRing focusRingClass='ring ring-offset-2'>
              <button
                aria-label='Close main menu'
                onClick={handleCloseSidebarFilters}
                className='flex cursor-pointer flex-col items-center justify-center border-none bg-transparent p-[6px] outline-none transition-colors duration-300 hover:text-gray-700'
              >
                <Close size={14} />
              </button>
            </FocusRing>
          </header>
          {choosenFilters}
          <>
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className='absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-gray-700'
                >
                  <Loader size={62} borderColor='#fff' />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <ul className='flex grow flex-col gap-2 pb-28'>
                {filterOptions.map((option, idx) => {
                  const headingId = `${buttonLabel}-heading-${idx}`
                  const contentId = `${buttonLabel}-content-${idx}`

                  const isSelected = option.label === selectedFilterOption
                  const isLast = filterOptions.length - 1 === idx

                  if (!option.content) {
                    return null
                  }

                  return (
                    <li
                      key={headingId}
                      className={clsx(
                        'gilroy-sm relative flex flex-col overflow-hidden border-t-[1px] border-gray-100 pr-[5px] pt-2 text-gray-900',
                        {
                          'border-b-[1px] pb-2': isLast,
                        },
                      )}
                    >
                      <Button
                        variant='secondary'
                        disableBorder
                        className='w-full py-2 !font-normal'
                        contentClassName='!justify-between'
                        onClick={() =>
                          onChangeSelectedFilterOption(prev =>
                            option.label === prev ? null : option.label,
                          )
                        }
                        rightIcon={{
                          icon: 'ChevronDown',
                          animateWhen: value => !!value,
                          value: isSelected,
                          animationProps: {
                            initial: { rotate: '0deg' },
                            exit: { rotate: '180deg' },
                          },
                        }}
                      >
                        {option.label}
                      </Button>

                      <div
                        id={contentId}
                        aria-labelledby={headingId}
                        aria-hidden={!isSelected}
                        className='gilroy-md text-gray-700'
                        style={{
                          display: 'grid',
                          gridTemplateRows: isSelected ? '1fr' : '0fr',
                          transition: 'grid-template-rows 300ms',
                        }}
                      >
                        <div className='overflow-hidden'>
                          {option.filterKey === 'price' ? (
                            <div className='flex gap-4'>
                              <Input
                                className='w-1/2'
                                type='number'
                                aria-label='minPrice'
                                label={filterLabels.price.minPrice}
                                placeholder='100'
                                min={+option.content[0] || 0}
                                max={+option.content[1]}
                                // @ts-ignore
                                value={tempFilters.price?.[0] || option.content[0]}
                                onChange={event => {
                                  const newMax =
                                    tempFilters.price?.[1] || (option.content as string[])[1]

                                  onChangeTempFilters(prev => ({
                                    ...prev,
                                    price:
                                      // @ts-ignore
                                      [
                                        String(Math.min(+event.target.value, +newMax)),
                                        String(Math.max(+event.target.value, +newMax)),
                                      ],
                                  }))
                                }}
                              />
                              <Input
                                className='w-1/2'
                                type='number'
                                aria-label='maxPrice'
                                label={filterLabels.price.maxPrice}
                                placeholder='200'
                                min={+option.content[0] || 0}
                                max={+option.content[1] || 0}
                                // @ts-ignore
                                value={tempFilters.price?.[1] || option.content[1]}
                                onChange={event => {
                                  const newMin =
                                    tempFilters.price?.[0] || (option.content as string[])[0]

                                  onChangeTempFilters(prev => ({
                                    ...prev,
                                    price: [
                                      String(Math.min(+event.target.value, +newMin)),
                                      String(Math.max(+event.target.value, +newMin)),
                                    ],
                                  }))
                                }}
                              />
                            </div>
                          ) : (
                            <CheckboxGroup
                              value={tempFilters[option.filterKey as keyof ModalFilters]}
                              onChange={value => {
                                handelUpdateFilters(option, value)
                              }}
                              disableLabel
                              label={option.label}
                              className='my-2 flex flex-col gap-3'
                            >
                              {/* @ts-ignore */}
                              {option.content.map(({ doc, count }) => {
                                if (count <= 0) {
                                  return null
                                }

                                return (
                                  <CheckboxGroup.Item
                                    key={doc.id}
                                    className='!max-w-full cursor-pointer'
                                    label={doc.label}
                                    value={doc.slug}
                                  >
                                    {`${doc.label} (${count})`}
                                  </CheckboxGroup.Item>
                                )
                              })}
                            </CheckboxGroup>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className='fixed bottom-0 left-0 right-0 max-w-[400px] bg-white px-4 pb-10 pt-3'>
              <Button
                isDisabled={
                  !updatedFilters?.totalProducts ||
                  startChangingFilters ||
                  isTheSameParams ||
                  isPending
                }
                isLoading={searchParamsUpdating || startChangingFilters}
                standartButton
                className='w-full'
                onClick={handelUpdateFilterParams}
              >
                {(updatedFilters?.totalProducts ?? 0) > 0 &&
                Object.values(selectedFilters).some(value => value.length > 0) &&
                !isTheSameParams
                  ? `${applyFilterButtonLabel} (${updatedFilters?.totalProducts ?? 0})`
                  : `${applyFilterButtonLabel}`}
              </Button>
            </div>
          </>
        </motion.aside>,
        body.current as HTMLElement,
        'filter-sidebar',
      )}
    </>
  )
}
