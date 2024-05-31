'use client'

import { ComponentProps, FC } from 'react'
import { Search } from '@oleksii-lavka/grocee-icons/icons'
import { NavLink } from './NavLink'
import { FocusRing } from 'react-aria'
import { Navigation } from 'ui'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type Props = {
  onLinkClick?: () => void
  links: ComponentProps<typeof Navigation>['navLinks']
  onSearchClick: () => void
  showNavItems?: boolean
  productsInCart?: number
}

export const NavItems: FC<Props> = ({
  onLinkClick,
  onSearchClick,
  showNavItems,
  productsInCart,
  links,
}) => {
  return (
    <motion.ul
      variants={{
        initial: { x: 0, opacity: 1 },
        hide: { x: 15, opacity: 0 },
      }}
      initial='initial'
      animate={showNavItems ? 'initial' : 'hide'}
      className={clsx('flex gap-4 mobile:gap-5 tablet:gap-6', {
        'pointer-events-none': !showNavItems,
      })}
    >
      <li className='flex items-center justify-center tablet:hidden'>
        <FocusRing focusRingClass='ring ring-offset-2'>
          <button
            onClick={onSearchClick}
            aria-label='search-input-trigger'
            className='border-none bg-transparent text-gray-900 outline-none transition-colors duration-300 hover:text-gray-700'
          >
            <Search width={18} height={24} />
          </button>
        </FocusRing>
      </li>
      <li>
        <NavLink {...links.delivery} onClick={onLinkClick} className='pt-1' />
      </li>
      <li>
        <NavLink {...links.cart} onClick={onLinkClick} badge={productsInCart} />
      </li>
      <li className='hidden min-[375px]:block'>
        <NavLink {...links.profile} onClick={onLinkClick} />
      </li>
    </motion.ul>
  )
}
