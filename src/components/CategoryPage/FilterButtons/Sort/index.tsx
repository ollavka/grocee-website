'use client'

import {
  FC,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react'
import { useWindowSize } from 'ui/hooks'
import { MobileSort } from './MobileSort'
import { GlobalTypography } from 'cms-types'
import { DesktopSort } from './DesktopSort'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { getSearchWith } from 'ui/helpers'
import { toast } from 'react-hot-toast'

export type SortProps = {
  sortTypography: GlobalTypography['categoryPage']['sortProducts']
}

export type SelectedOption = NonNullable<SortProps['sortTypography']['sortOptions']>[number] | null

export type Props = {
  sortBy: string | null
  sortOrder: 'asc' | 'desc' | null
  currentOption: SelectedOption
  selectedOption: SelectedOption
  handleUpdateSortParams: (newOption?: SelectedOption) => void
  onChangeSelectedOption: Dispatch<SetStateAction<SelectedOption>>
  searchParamsUpdating: boolean
  onChangeSearchParamsUpdating: Dispatch<SetStateAction<boolean>>
  paramsIsApplied: boolean
  onChangeParamsApplied: (value: boolean) => void
}

export const Sort: FC<SortProps> = ({ sortTypography }) => {
  const { sortOptions, sortParamsChangingMessages } = sortTypography
  const firstRender = useRef(true)

  const [searchParamsUpdating, setSearchParamsUpdating] = useState(false)
  const [selectedSortOption, setSelectedSortOption] = useState<SelectedOption>(null)
  const [toastLoadingId, setToastLoadingId] = useState<string | null>(null)
  const [paramsIsApplied, setParamsIsApplied] = useState(false)

  const { isMobile, isTablet } = useWindowSize()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const { sortBy, sortOrder } = useMemo(
    () => ({
      sortBy: searchParams.get('sort') || null,
      sortOrder: (searchParams.get('order') || null) as 'desc' | 'asc' | null,
    }),
    [searchParams],
  )

  const currentOption: SelectedOption = useMemo(() => {
    if (selectedSortOption) {
      return selectedSortOption
    }

    if (!sortOptions?.length || !sortBy) {
      return null
    }

    const foundOption = sortOptions.find(option => {
      const order = sortOrder || 'asc'

      return option.productFieldToSort?.split('.').at(-1) === sortBy && option.sortOrder === order
    })

    return foundOption || null
  }, [sortBy, sortOrder, sortOptions, selectedSortOption])

  const handleUpdateSortParams = useCallback(
    (sortOption?: SelectedOption) => {
      const option = sortOption && !isMobile && !isTablet ? sortOption : selectedSortOption

      setSearchParamsUpdating(true)

      const { sortOrder: sortOrderValue, productFieldToSort } = option || {}

      if (sortOrderValue === sortOrder && sortBy === productFieldToSort?.split('.').at(-1)) {
        setSearchParamsUpdating(false)

        return
      }

      const params = getSearchWith(searchParams, {
        sort: !option || !productFieldToSort ? null : productFieldToSort.split('.').at(-1)!,
        order: !option || !sortOrderValue ? null : sortOrderValue,
        page: '1',
      })

      if (!params) {
        router.push(pathname)
      }

      router.push(`${pathname}?${params}`)
    },
    [searchParams, isMobile, isTablet, sortBy, sortOrder, selectedSortOption, pathname, router],
  )

  useEffect(() => {
    setSearchParamsUpdating(false)
  }, [sortBy, sortOrder])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false

      return
    }

    if (sortParamsChangingMessages.success) {
      toast.success(sortParamsChangingMessages.success)
    }

    setParamsIsApplied(true)
  }, [sortParamsChangingMessages.success, sortBy, sortOrder])

  useEffect(() => {
    if (firstRender.current) {
      return
    }

    if (!searchParamsUpdating && toastLoadingId) {
      toast.remove(toastLoadingId)
    }

    if (searchParamsUpdating && !isMobile && !isTablet && sortParamsChangingMessages.pending) {
      const toastLoadingId = toast.loading(sortParamsChangingMessages.pending)
      setToastLoadingId(toastLoadingId)
    }
  }, [sortParamsChangingMessages.pending, searchParamsUpdating, isMobile, isTablet])

  const CurrentSort = isMobile || isTablet ? MobileSort : DesktopSort

  return (
    <CurrentSort
      paramsIsApplied={paramsIsApplied}
      onChangeParamsApplied={setParamsIsApplied}
      selectedOption={selectedSortOption}
      currentOption={currentOption}
      sortBy={sortBy}
      sortOrder={sortOrder}
      handleUpdateSortParams={handleUpdateSortParams}
      onChangeSelectedOption={setSelectedSortOption}
      sortTypography={sortTypography}
      searchParamsUpdating={searchParamsUpdating}
      onChangeSearchParamsUpdating={setSearchParamsUpdating}
    />
  )
}
