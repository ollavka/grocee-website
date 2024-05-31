'use client'

import { FC, Dispatch, useEffect, useCallback, SetStateAction } from 'react'
import { Select, SelectOptionType } from 'ui'
import { Props, SelectedOption, SortProps } from '.'

export const DesktopSort: FC<SortProps & Props> = ({
  sortTypography,
  currentOption,
  onChangeSelectedOption,
  handleUpdateSortParams,
  selectedOption,
}) => {
  const mappedSortOptions = (sortTypography.sortOptions ?? []).map(({ label, id }) => ({
    label: label!,
    value: id!,
  }))

  const handleChangeSortParam = useCallback(
    (option: SelectOptionType<string> | null) => {
      if (!option) {
        return
      }

      if (currentOption?.id === option.value) {
        onChangeSelectedOption(null)

        return
      }

      const newOption = ((sortTypography.sortOptions ?? []).find(({ id }) => id === option.value) ||
        null) as SelectedOption

      onChangeSelectedOption(prev => (prev?.id === option.value ? null : newOption))

      if (selectedOption?.id !== option.value) {
        handleUpdateSortParams(newOption)
      }
    },
    [currentOption, selectedOption, handleUpdateSortParams],
  )

  return (
    <Select
      listPosition={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      animationOrigin='top right'
      label={{ select: 'sort-select', listOptions: 'sort-select-option', option: 'sort-option' }}
      options={mappedSortOptions}
      useAsTriggerLabel='label'
      triggerProps={{
        variant: 'tertiary',
        standartButton: true,
        rightIcon: { icon: 'SwapVertical' },
        children: sortTypography.label,
      }}
      listWidth={300}
      onChange={handleChangeSortParam}
      selectedValue={currentOption?.id}
    />
  )
}
