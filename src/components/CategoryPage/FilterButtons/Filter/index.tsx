'use client'

import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Country, GlobalTypography, Special, Tag, Trademark } from 'cms-types'
import { useWindowSize } from 'ui/hooks'
import { MobileFilter } from './MobileFilter'
import { DesktopFilter } from './DesktopFilter'
import { FilterButtonProps } from '..'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProductsCountByFilters } from '@/cms'
import toast from 'react-hot-toast'
import { getSearchWith } from 'ui/helpers'
import { Tag as TagUI } from 'ui'
import { Close } from '@oleksii-lavka/grocee-icons/icons'
import { FocusRing } from 'react-aria'

export type FilterOption = {
  filterKey: string
  label: string
  content:
    | {
        doc: Tag | Special | Country | Trademark
        count: number
      }[]
    | string[]
    | null
}

export type Props = {
  isOpen: boolean
  onChangeFilterModalOpened: (value: boolean) => void
  filterOptions: FilterOption[]
  selectedFilterOption: string | null
  onChangeSelectedFilterOption: Dispatch<SetStateAction<string | null>>
  tempFilters: ModalFilters
  onChangeTempFilters: Dispatch<SetStateAction<ModalFilters>>
  selectedFilters: ModalFilters
  handelUpdateFilters: (option: FilterOption, value: string[]) => void
  startChangingFilters: boolean
  searchParamsUpdating: boolean
  updatedFilters?: Awaited<ReturnType<typeof getProductsCountByFilters>>
  handelUpdateFilterParams: () => void
  isPending: boolean
  isTheSameParams: boolean
  choosenFilters: JSX.Element
  paramsIsApplied: boolean
  onChangeParamsApplied: (value: boolean) => void
}

export type FilterProps = {
  filterTypography: GlobalTypography['categoryPage']['filterProducts']
} & FilterButtonProps

export type ModalFilters = Partial<Record<keyof FilterProps['filters'], string[]>>

export const Filter: FC<FilterProps> = ({ filterTypography, category, filters }) => {
  const { isMobile, isTablet } = useWindowSize()

  const { filterParamsChangingMessages, filterLabels } = filterTypography

  const prevUpdatedFilters = useRef<Props['updatedFilters']>()

  const firstRender = useRef(true)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [selectedFilterOption, setSelectedFilterOption] = useState<string | null>(null)
  const [filterModalOpened, setFilterModalOpened] = useState(false)
  const [filterSidebarOpened, setFilterSidebarOpened] = useState(false)
  const [searchParamsUpdating, setSearchParamsUpdating] = useState(false)
  const [startChangingFilters, setStartChangingFilters] = useState(false)
  const [paramsIsApplied, setParamsIsApplied] = useState(false)

  const {
    subcategorySlug,
    countriesParam,
    specialsParam,
    tagsParam,
    trademarksParam,
    minPriceParam,
    maxPriceParam,
  } = useMemo(
    () => ({
      subcategorySlug: searchParams.get('subcat') || null,
      countriesParam: searchParams.get('countries') || null,
      specialsParam: searchParams.get('specials') || null,
      tagsParam: searchParams.get('tags') || null,
      trademarksParam: searchParams.get('trademarks') || null,
      minPriceParam: searchParams.get('minPrice') || null,
      maxPriceParam: searchParams.get('maxPrice') || null,
    }),
    [searchParams],
  )

  const [tempFilters, setTempFilters] = useState<ModalFilters>({
    countries: [],
    specials: [],
    tags: [],
    trademarks: [],
    price: [],
  })
  const [selectedFilters, setSelectedFilters] = useState<ModalFilters>({
    countries: [],
    specials: [],
    tags: [],
    trademarks: [],
    price: [],
  })

  const {
    data: updatedFilters,
    isPending,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['filterParams', subcategorySlug, selectedFilters],
    queryFn: async () => {
      if (firstRender.current) {
        return null
      }

      const {
        trademarks = [],
        countries = [],
        specials = [],
        tags = [],
        price = [],
      } = selectedFilters

      const data = await getProductsCountByFilters({
        categoryId: category.id,
        subcategorySlug: subcategorySlug ?? '',
        trademarks,
        countries,
        specials,
        tags,
        price: {
          // @ts-ignore
          min: price[0],
          // @ts-ignore
          max: price[1],
        },
      })

      prevUpdatedFilters.current = data

      setSelectedFilters(prev => ({
        ...prev,
        countries: (prev.countries ?? []).filter(slug =>
          data.filters.countries.some(value => value.doc.slug === slug),
        ),
        tags: (prev.tags ?? []).filter(slug =>
          data.filters.tags.some(value => value.doc.slug === slug),
        ),
        trademarks: (prev.trademarks ?? []).filter(slug =>
          data.filters.trademarks.some(value => value.doc.slug === slug),
        ),
        specials: (prev.specials ?? []).filter(slug =>
          data.filters.specials.some(value => value.doc.slug === slug),
        ),
      }))

      setStartChangingFilters(false)

      return data
    },
  })

  const currentFilters = useMemo(() => {
    if (prevUpdatedFilters.current) {
      return prevUpdatedFilters.current.filters
    }

    if (!updatedFilters?.filters) {
      return filters
    }

    return updatedFilters?.filters
  }, [updatedFilters, prevUpdatedFilters.current, filters])

  const filterOptions = useMemo(() => {
    const { promotionalOffers, trademarks, countries, specials, price } = filterLabels

    const options = [
      {
        filterKey: 'tags',
        label: promotionalOffers,
        content: currentFilters?.tags,
      },
      {
        filterKey: 'trademarks',
        label: trademarks,
        content: currentFilters?.trademarks,
      },
      {
        filterKey: 'countries',
        label: countries,
        content: currentFilters?.countries,
      },
      {
        filterKey: 'specials',
        label: specials,
        content: currentFilters?.specials,
      },
      {
        filterKey: 'price',
        label: price.label,
        content: [
          String(currentFilters?.price?.min ?? ''),
          String(currentFilters?.price?.max ?? ''),
        ],
      },
    ].filter(({ content }) => (Array.isArray(content) ? content.length > 0 : content))

    return options
  }, [filterLabels, currentFilters])

  const isTheSameParams = useMemo(() => {
    const countries = encodeURIComponent((selectedFilters?.countries ?? []).join(',')) || null
    const tags = encodeURIComponent((selectedFilters?.tags ?? []).join(',')) || null
    const specials = encodeURIComponent((selectedFilters?.specials ?? []).join(',')) || null
    const trademarks = encodeURIComponent((selectedFilters?.trademarks ?? []).join(',')) || null
    const minPrice = currentFilters?.price?.min || null
    const maxPrice = currentFilters?.price?.max || null

    const isNewParams = [
      [countriesParam, countries],
      [tagsParam, tags],
      [specialsParam, specials],
      [trademarksParam, trademarks],
      [+(tempFilters.price?.[0] ?? 0) || minPrice, +(minPriceParam ?? 0) || minPrice],
      [+(tempFilters.price?.[1] ?? 0) || maxPrice, +(maxPriceParam ?? 0) || maxPrice],
    ].some(param => {
      const [searchParam, newParam] = param

      if (typeof searchParam === 'string' && typeof newParam === 'string') {
        return decodeURIComponent(searchParam ?? '') !== decodeURIComponent(newParam ?? '')
      }

      return searchParam !== newParam
    })

    return !isNewParams
  }, [
    selectedFilters,
    countriesParam,
    tagsParam,
    specialsParam,
    trademarksParam,
    minPriceParam,
    maxPriceParam,
    tempFilters.price,
  ])

  const choosenFilters = useMemo(() => {
    const currentFilters = updatedFilters?.filters || filters

    const { price, ...restTempFilters } = tempFilters
    const [minPriceFilter, maxPriceFilter] = price ?? []

    const mappedFilters = Object.entries(restTempFilters).flatMap(filter => {
      const [key, value] = filter
      const currentFilter = currentFilters[key as keyof Omit<ModalFilters, 'price'>]

      return currentFilter
        .filter(({ doc }) => value.includes(doc.slug))
        .map(({ doc }) => ({ ...doc, key }))
    })

    const removeFilter = (key: keyof ModalFilters, slug: string) => {
      setTempFilters(prev => ({
        ...prev,
        [key]: (prev[key] ?? []).filter(value => value !== slug),
      }))
    }

    return (
      <div className='mb-4 flex flex-wrap gap-2'>
        {((minPriceFilter && +minPriceFilter !== +(currentFilters?.price?.min ?? 0)) ||
          (maxPriceFilter && +maxPriceFilter !== +(currentFilters?.price?.max ?? 0))) && (
          <TagUI
            type='bordered'
            className='!after:hidden flex items-center gap-2 !py-1 tablet:!py-2'
          >
            <span className='select-none'>{`${minPriceFilter || currentFilters.price.min}-${maxPriceFilter || currentFilters.price.max}`}</span>
            <FocusRing focusRingClass='ring ring-offset-2'>
              <button
                style={{ zIndex: 4 }}
                className='relative !cursor-pointer border-none bg-transparent outline-none'
                onClick={() => {
                  setTempFilters(prev => ({
                    ...prev,
                    price: [String(currentFilters.price.min), String(currentFilters.price.max)],
                  }))
                }}
              >
                <Close size={12} />
              </button>
            </FocusRing>
          </TagUI>
        )}
        {mappedFilters.map(({ id, label, slug, key }) => (
          <TagUI
            key={id}
            type='bordered'
            className='!after:hidden flex items-center gap-2 !py-1 tablet:!py-2'
          >
            <span className='select-none'>{label}</span>
            <FocusRing focusRingClass='ring ring-offset-2'>
              <button
                style={{ zIndex: 4 }}
                className='relative !cursor-pointer border-none bg-transparent outline-none'
                onClick={() => removeFilter(key as keyof ModalFilters, slug)}
              >
                <Close size={12} />
              </button>
            </FocusRing>
          </TagUI>
        ))}
      </div>
    )
  }, [tempFilters, filters, currentFilters, updatedFilters])

  const handelUpdateFilters = useCallback(
    (option: (typeof filterOptions)[number], value: string[]) => {
      setStartChangingFilters(true)

      setTempFilters(prev => ({
        ...prev,
        [option.filterKey as keyof ModalFilters]: value,
      }))
    },
    [],
  )

  useEffect(() => {
    if (firstRender.current) {
      return
    }

    const timeoutId = setTimeout(() => {
      setSelectedFilters(tempFilters)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [tempFilters])

  useEffect(() => {
    setSearchParamsUpdating(false)
  }, [countriesParam, specialsParam, tagsParam, trademarksParam, minPriceParam, maxPriceParam])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false

      return
    }

    if (filterParamsChangingMessages.success) {
      toast.success(filterParamsChangingMessages.success)
    }

    setParamsIsApplied(true)
  }, [
    filterParamsChangingMessages.success,
    countriesParam,
    specialsParam,
    tagsParam,
    trademarksParam,
    minPriceParam,
    maxPriceParam,
  ])

  const handelUpdateFilterParams = useCallback(() => {
    setSearchParamsUpdating(true)

    const countries = encodeURIComponent((selectedFilters?.countries ?? []).join(',')) || null
    const tags = encodeURIComponent((selectedFilters?.tags ?? []).join(',')) || null
    const specials = encodeURIComponent((selectedFilters?.specials ?? []).join(',')) || null
    const trademarks = encodeURIComponent((selectedFilters?.trademarks ?? []).join(',')) || null
    const minPrice = selectedFilters.price?.[0] || null
    const maxPrice = selectedFilters.price?.[1] || null

    if (isTheSameParams) {
      setSearchParamsUpdating(false)
      return
    }

    const params = getSearchWith(searchParams, {
      countries,
      tags,
      specials,
      trademarks,
      minPrice,
      maxPrice,
      page: '1',
    })

    if (!params) {
      router.push(pathname)
    }

    router.push(`${pathname}?${params}`)
  }, [searchParams, updatedFilters, selectedFilters, pathname, router])

  useEffect(() => {
    if (filterModalOpened || firstRender.current) {
      return
    }

    setSearchParamsUpdating(false)
    setSelectedFilterOption(null)
  }, [filterModalOpened])

  useEffect(() => {
    setTempFilters(() => {
      const countries = decodeURIComponent(countriesParam ?? '')
        .split(',')
        .filter(Boolean)

      const tags = decodeURIComponent(tagsParam ?? '')
        .split(',')
        .filter(Boolean)

      const specials = decodeURIComponent(specialsParam ?? '')
        .split(',')
        .filter(Boolean)

      const trademarks = decodeURIComponent(trademarksParam ?? '')
        .split(',')
        .filter(Boolean)

      return {
        countries,
        specials,
        tags,
        trademarks,
        price: [minPriceParam ?? '', maxPriceParam ?? ''],
      }
    })
  }, [])

  const CurrentFilter = isMobile || isTablet ? MobileFilter : DesktopFilter

  return (
    <CurrentFilter
      paramsIsApplied={paramsIsApplied}
      onChangeParamsApplied={setParamsIsApplied}
      filterTypography={filterTypography}
      category={category}
      //@ts-ignore
      filterOptions={filterOptions}
      handelUpdateFilterParams={handelUpdateFilterParams}
      // @ts-ignore
      handelUpdateFilters={handelUpdateFilters}
      onChangeTempFilters={setTempFilters}
      isOpen={isMobile || isTablet ? filterModalOpened : filterSidebarOpened}
      onChangeFilterModalOpened={
        isMobile || isTablet ? setFilterModalOpened : setFilterSidebarOpened
      }
      isPending={isPending || isLoading || isFetching}
      onChangeSelectedFilterOption={setSelectedFilterOption}
      searchParamsUpdating={searchParamsUpdating}
      selectedFilterOption={selectedFilterOption}
      selectedFilters={selectedFilters}
      tempFilters={tempFilters}
      startChangingFilters={startChangingFilters}
      updatedFilters={updatedFilters!}
      isTheSameParams={isTheSameParams}
      choosenFilters={choosenFilters}
    />
  )
}
