/* eslint-disable no-unused-vars */
'use client'

import { FC, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from '@oleksii-lavka/grocee-icons/icons'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSearchWith } from '../../helpers'

export type PaginationProps = {
  totalPages: number
  page: number
  className?: string
}

export const Pagination: FC<PaginationProps> = ({ page, className = '', totalPages }) => {
  const searchParams = useSearchParams()
  const normalizedPage = useMemo(
    () => (page > totalPages || page < 1 ? 1 : page),
    [page, totalPages],
  )

  const hasSeparators = useMemo(
    () => ({
      left: normalizedPage >= 5 && totalPages >= 8,
      right: totalPages - normalizedPage >= 4 && totalPages >= 8,
    }),
    [normalizedPage, totalPages],
  )

  const paginationItems = useMemo(() => {
    let items = Array.from({ length: totalPages - 2 }, (_, idx) => idx + 2)

    if (hasSeparators.left && !hasSeparators.right) {
      items = items.slice(items.length - 5)
    }

    if (!hasSeparators.left && hasSeparators.right) {
      items = items.slice(0, normalizedPage + 4)
    }

    if (hasSeparators.left && hasSeparators.right) {
      items = items.slice(normalizedPage - 4, normalizedPage + 1)
    }

    return items
  }, [hasSeparators, normalizedPage, totalPages])

  const updateSearchParams = useCallback(
    ({ type, newPageNumber }: { type?: 'prev' | 'next'; newPageNumber?: number }) => {
      const newPage =
        newPageNumber !== undefined
          ? newPageNumber
          : type === 'prev'
            ? normalizedPage - 1 || 1
            : normalizedPage + 1 || normalizedPage

      const params = getSearchWith(searchParams, {
        page: newPage.toString(),
      })

      return params.split('&').reduce(
        (acc, param) => {
          const [key, value] = param.split('=')

          if (key === undefined || value === undefined) {
            return acc
          }

          if (!(key in acc)) {
            acc[key] = value
          }

          return acc
        },
        {} as Record<string, string>,
      )
    },
    [normalizedPage, searchParams],
  )

  return (
    <ul
      className={clsx('flex select-none items-center justify-center gap-4 tablet:gap-8', className)}
    >
      <li
        role='link'
        aria-label='prev'
        className={clsx('-mr-2', {
          'pointer-events-none text-gray-400': normalizedPage === 1,
        })}
      >
        <Link className='no-underline' href={{ query: updateSearchParams({ type: 'prev' }) }}>
          <ChevronLeft size={24} className='p-[6px]' />
        </Link>
      </li>
      <li
        role='link'
        aria-label='1'
        className={clsx('gilroy-md cursor-pointer transition-colors duration-300', {
          'text-gray-900': normalizedPage === 1,
          'font-light text-gray-400 hover:text-gray-700': normalizedPage !== 1,
        })}
      >
        <Link className='no-underline' href={{ query: updateSearchParams({ newPageNumber: 1 }) }}>
          {1}
        </Link>
      </li>

      {hasSeparators.left && (
        <li
          aria-label='separator'
          className='gilroy-md pointer-events-none font-light text-gray-400'
        >
          ...
        </li>
      )}

      {paginationItems.map(pageNumber => (
        <li
          key={pageNumber}
          className={clsx('gilroy-md cursor-pointer transition-colors duration-300', {
            'text-gray-900': normalizedPage === pageNumber,
            'font-light text-gray-400 hover:text-gray-700': normalizedPage !== pageNumber,
          })}
        >
          <Link
            className='no-underline'
            href={{ query: updateSearchParams({ newPageNumber: pageNumber }) }}
          >
            {pageNumber}
          </Link>
        </li>
      ))}

      {hasSeparators.right && (
        <li
          aria-label='separator'
          className='gilroy-md pointer-events-none font-light text-gray-400'
        >
          ...
        </li>
      )}

      <li
        role='link'
        aria-label={totalPages.toString()}
        className={clsx('gilroy-md cursor-pointer transition-colors duration-300', {
          'text-gray-900': normalizedPage === totalPages,
          'font-light text-gray-400 hover:text-gray-700': normalizedPage !== totalPages,
        })}
      >
        <Link
          className='no-underline'
          href={{ query: updateSearchParams({ newPageNumber: totalPages }) }}
        >
          {totalPages}
        </Link>
      </li>
      <li
        role='link'
        aria-label='next'
        className={clsx('-ml-2', {
          'pointer-events-none text-gray-400': normalizedPage === totalPages,
        })}
      >
        <Link className='no-underline' href={{ query: updateSearchParams({ type: 'next' }) }}>
          <ChevronRight size={24} className='p-[6px]' />
        </Link>
      </li>
    </ul>
  )
}
