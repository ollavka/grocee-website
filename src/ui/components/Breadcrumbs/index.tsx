'use client'

import { FC, Fragment } from 'react'
import { ChevronRight } from '@oleksii-lavka/grocee-icons/icons'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { FocusRing } from 'react-aria'

export type Breadcrumb = {
  id?: string | null
  label: string
  url: string
}

type Props = {
  breadcrumbs?: Breadcrumb[]
  className?: string
}

export const Breadcrumbs: FC<Props> = ({ breadcrumbs = [], className }) => {
  const pathname = usePathname()

  if (!breadcrumbs?.length) {
    return null
  }

  return (
    <ul className={clsx('flex flex-wrap items-center gap-1 tablet:gap-2', className)}>
      {breadcrumbs.map(({ id, label, url }, idx) => (
        <Fragment key={id || label}>
          {idx > 0 && (
            <li>
              <ChevronRight
                className={clsx('p-[6px]', {
                  'text-gray-400': pathname !== url,
                  'pointer-events-none text-gray-900': pathname === url,
                })}
                size={24}
              />
            </li>
          )}
          <li>
            <FocusRing focusRingClass='ring ring-offset-2'>
              <Link
                className={clsx(
                  'gilroy-sm inline-block font-light !leading-6 no-underline tablet:text-[16px] tablet:leading-[150%]',
                  {
                    'text-gray-400 transition-colors duration-300 hover:text-gray-900':
                      pathname !== url,
                    'pointer-events-none text-gray-900': pathname === url,
                  },
                )}
                href={url}
              >
                {label}
              </Link>
            </FocusRing>
          </li>
        </Fragment>
      ))}
    </ul>
  )
}
