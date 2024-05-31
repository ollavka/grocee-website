'use client'

import {
  FC,
  useCallback,
  Dispatch,
  SetStateAction,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react'
import { BottomModal, Button } from 'ui'
import modalService from 'ui/service/modalService'
import { Props, SelectedOption, SortProps } from '.'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCirleFilled } from '@oleksii-lavka/grocee-icons/icons'

export const MobileSort: FC<SortProps & Props> = ({
  sortTypography,
  currentOption,
  sortBy,
  sortOrder,
  handleUpdateSortParams,
  onChangeSelectedOption,
  searchParamsUpdating,
  selectedOption,
  onChangeSearchParamsUpdating,
  paramsIsApplied,
  onChangeParamsApplied,
}) => {
  const { applySortButtonLabel, sortOptions, label } = sortTypography

  const [startOpenAnimation, setStartOpenAnimation] = useState(false)
  const [sortModalOpened, setSortModalOpened] = useState(false)

  const isApplySortButtonDisabled = useMemo(() => {
    if (!sortBy && !selectedOption) {
      return true
    }

    const order = sortOrder || 'asc'

    return (
      currentOption?.sortOrder === order &&
      sortBy === currentOption?.productFieldToSort?.split('.').at(-1)
    )
  }, [sortBy, sortOrder, currentOption])

  const handleOpenSortModal = useCallback(() => {
    if (startOpenAnimation) {
      return
    }

    setSortModalOpened(true)

    modalService.changeModalState('bottomModal', true, { fade: 'full' })
  }, [startOpenAnimation])

  const handleCloseSortModal = useCallback(() => {
    setSortModalOpened(false)

    modalService.changeModalState('bottomModal', false, { fade: 'full' })
  }, [])

  const handleChangeSortParam = useCallback(
    (option: SelectedOption) => {
      onChangeSearchParamsUpdating(false)

      if (currentOption?.id === option?.id) {
        onChangeSelectedOption(null)

        return
      }

      onChangeSelectedOption(prev => (prev?.id === option?.id ? null : option))
    },
    [currentOption],
  )

  useEffect(() => {
    if (sortModalOpened) {
      return
    }

    onChangeSelectedOption(null)
    onChangeSearchParamsUpdating(false)
  }, [sortModalOpened])

  useEffect(() => {
    if (paramsIsApplied) {
      handleCloseSortModal()
      onChangeParamsApplied(false)
    }
  }, [paramsIsApplied])

  return (
    <>
      <Button
        variant='tertiary'
        onClick={handleOpenSortModal}
        standartButton
        rightIcon={{ icon: 'Filter' }}
      >
        {label}
      </Button>
      <BottomModal
        modalKey='sort'
        isOpen={sortModalOpened}
        onClose={handleCloseSortModal}
        onChangeStartOpenAnimation={setStartOpenAnimation}
      >
        <div className='flex flex-col gap-6'>
          <ul className='flex flex-col gap-2'>
            {sortOptions?.map(option => (
              <motion.li key={option.id} className='gilroy-sm relative px-4 text-gray-900'>
                <AnimatePresence>
                  {option.id === currentOption?.id && (
                    <motion.div
                      transition={{
                        duration: 0.25,
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      className='absolute inset-0 flex origin-center items-center justify-end bg-gray-100 px-4'
                      style={{ borderRadius: 9999 }}
                    >
                      <CheckCirleFilled className='text-success-500' size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  variant='secondary'
                  disableBorder
                  className='w-full py-2 !font-normal'
                  contentClassName='!justify-start relative'
                  onClick={() => handleChangeSortParam(option)}
                >
                  {option.label}
                </Button>
              </motion.li>
            ))}
          </ul>
          <Button
            isDisabled={isApplySortButtonDisabled}
            isLoading={searchParamsUpdating}
            // @ts-ignore
            onClick={handleUpdateSortParams}
            standartButton
          >
            {applySortButtonLabel}
          </Button>
        </div>
      </BottomModal>
    </>
  )
}
