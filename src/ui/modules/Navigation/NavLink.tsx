'use client'

import { FC, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { FocusRing } from 'react-aria'
import { AllIconNames, mapIcon } from '@oleksii-lavka/grocee-icons'

type NavLinkType = {
  className?: string
  link: string
  defaultIcon: {
    icon: AllIconNames
    size: {
      width: number
      height: number
    }
  }
  activeIcon: {
    icon: AllIconNames
    size: {
      width: number
      height: number
    }
  }
  badge?: number
  onClick?: () => void
}

export const NavLink: FC<NavLinkType> = ({
  activeIcon,
  defaultIcon,
  link,
  badge,
  onClick,
  className = '',
}) => {
  const pathname = usePathname()

  const currentIcon = useMemo(() => {
    const { icon, size } = pathname.startsWith(link) ? activeIcon : defaultIcon

    const Icon = mapIcon(icon)

    if (Icon) {
      return <Icon width={size.width} height={size.height} />
    }

    return null
  }, [pathname, link, activeIcon, defaultIcon])

  return (
    <FocusRing focusRingClass='ring ring-offset-2'>
      <Link
        onClick={onClick}
        href={link}
        className={clsx(
          'relative transition-colors duration-300 hover:text-gray-700',
          'flex h-6 w-6 items-center justify-center',
          className,
        )}
      >
        {(badge ?? 0) > 0 && (
          <span className='gilroy-xs absolute bottom-3 left-3 flex h-[18px] w-[18px] items-center justify-center rounded-[50%] border-[1px] border-white bg-error-500 font-light text-white'>
            {badge}
          </span>
        )}
        {currentIcon}
      </Link>
    </FocusRing>
  )
}
