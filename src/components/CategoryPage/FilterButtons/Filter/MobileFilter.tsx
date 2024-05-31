'use client'

import { useState, FC, useCallback, useEffect } from 'react'
import { BottomModal, Button, CheckboxGroup, Input, Loader } from 'ui'
import { FilterProps, ModalFilters, Props } from '.'
import modalService from 'ui/service/modalService'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

export const MobileFilter: FC<Omit<FilterProps, 'filters'> & Props> = ({
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
  choosenFilters,
  isTheSameParams,
  paramsIsApplied,
  onChangeParamsApplied,
  onChangeTempFilters,
}) => {
  const { label: buttonLabel, applyFilterButtonLabel, filterLabels } = filterTypography
  const [startOpenAnimation, setStartOpenAnimation] = useState(false)

  const handleOpenFilterModal = useCallback(() => {
    if (startOpenAnimation) {
      return
    }

    onChangeFilterModalOpened(true)

    modalService.changeModalState('bottomModal', true, { fade: 'full' })
  }, [startOpenAnimation])

  const handleCloseFilterModal = useCallback(() => {
    onChangeFilterModalOpened(false)

    modalService.changeModalState('bottomModal', false, { fade: 'full' })
  }, [])

  useEffect(() => {
    if (paramsIsApplied) {
      handleCloseFilterModal()
      onChangeParamsApplied(false)
    }
  }, [paramsIsApplied])

  return (
    <>
      <Button
        variant='tertiary'
        onClick={handleOpenFilterModal}
        standartButton
        rightIcon={{ icon: 'Filter' }}
      >
        {buttonLabel}
      </Button>
      <BottomModal
        className='overflow-y-auto'
        isOpen={isOpen}
        onClose={handleCloseFilterModal}
        modalKey='filter'
        onChangeStartOpenAnimation={setStartOpenAnimation}
      >
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
          {choosenFilters}
          <div className='h-[520px] max-h-[520px] min-h-[520px]'>
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
                      'gilroy-sm relative flex flex-col overflow-hidden border-t-[1px] border-gray-100 px-4 pt-2 text-gray-900',
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
          <div className='fixed bottom-0 left-0 right-0 bg-white px-4 pb-10 pt-3'>
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
      </BottomModal>
    </>
  )
}
