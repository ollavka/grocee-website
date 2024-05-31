'use client'
// @ts-nocheck

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavItems } from './NavItems'
import { SearchBar } from './SearchBar'
import { type Image as PayloadImageType, MainNavigation } from 'cms-types'
import Link from 'next/link'
import { PayloadImage } from '../..'
import { BurgerMenu } from './BurgerMenu'
import { FocusRing } from 'react-aria'
import { MobileSideBar } from './SideBar/MobileSideBar'
import modalService from '../../service/modalService'
import { useOnClickOutside } from 'usehooks-ts'
import { AllIconNames } from '@oleksii-lavka/grocee-icons'
import { CommonLink, MappedCard } from '../../types'
import { useWindowSize } from '../../hooks'
import { DesktopSideBar } from './SideBar/DesktopSideBar'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEdgeBlocksOnPage, useSearchHistory } from 'store'
import { SearchField } from './SearchBar/SearchField'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

type CommonNavigationProps = {
  title: string
  icon: {
    icon: AllIconNames
    size: {
      width: number
      height: number
    }
  }
}

type Support = {
  links: {
    id: string
    caption: string
    info: string
    href: string
    icon?: {
      icon?: AllIconNames
      size?: {
        width: number
        height: number
      }
    }
  }[]
}

type NavigationType = {
  categories: CommonNavigationProps & {
    cardLinks: MappedCard[]
    commonLinks: CommonLink[]
  }
  promotions: CommonNavigationProps & {
    cardLinks: MappedCard[]
  }
  integration: CommonNavigationProps & {
    logos: {
      id: string
      logo?: PayloadImageType
    }[]
  }
}

type NavigationProps = Pick<MainNavigation['header'], 'search'> &
  Pick<MainNavigation, 'defaultMenuHeader'> & {
    logo: PayloadImageType
    logoUrl: string
    navigation: NavigationType
    helpNavigation: CommonLink[]
    navLinks: Record<
      keyof MainNavigation['header']['navLinks'],
      {
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
      }
    >
    accountField: {
      mainMenuAccountField: {
        link: string
        title: string
        description: string
      }
    } | null
    support: Support | null
    backButton: {
      label: string
      icon: {
        icon: AllIconNames
        size: {
          width: number
          height: number
        }
      }
    }
    productsInCart?: number
  }

export const Navigation: FC<NavigationProps> = ({
  logo,
  logoUrl,
  search,
  navLinks,
  productsInCart,
  ...props
}) => {
  const [startSearchLoading, setStartSearchLoading] = useState(false)
  const [burgerMenuOpened, setBurgerMenuOpened] = useState(false)
  const [searchBarOpened, setSearchBarOpened] = useState(false)

  const searchFieldRef = useRef<HTMLInputElement | null>(null)
  const navigationRef = useRef<HTMLDivElement | null>(null)
  const mobileAsideRef = useRef<HTMLElement | null>(null)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { isMobile, isTablet, isLaptop, isDesktop, windowSize } = useWindowSize()
  const { addHistoryItem, setItemForPush } = useSearchHistory()
  const { firstBlockOnPage } = useEdgeBlocksOnPage()

  const navigationFade = useMemo(
    () => (isMobile || isTablet ? 'full' : 'showHeader'),
    [isMobile, isTablet],
  )

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

  const showEdgeNavItems = useMemo(
    () => isMobile || (!searchBarOpened && !isMobile),
    [searchBarOpened, isMobile, isTablet, isDesktop, isLaptop],
  )

  const handleOpenSearchBar = useCallback(() => {
    handleCloseBurgerMenu()

    setSearchBarOpened(true)
    modalService.changeModalState('searchBar', true, { fade: 'showHeader', headerOffsetRight })
  }, [windowSize.width, headerOffsetRight])

  const handleCloseSearchBar = useCallback(() => {
    setSearchBarOpened(false)
    modalService.changeModalState('searchBar', false)
  }, [windowSize.width])

  const toggleSearchBar = useCallback(() => {
    if (searchBarOpened) {
      handleCloseSearchBar()

      return
    }

    handleOpenSearchBar()
  }, [searchBarOpened, handleOpenSearchBar, handleCloseSearchBar])

  const handleOpenBurgerMenu = useCallback(() => {
    handleCloseSearchBar()

    setBurgerMenuOpened(true)
    modalService.changeModalState('burgerMenu', true, {
      fade: navigationFade,
      headerOffsetRight,
    })
  }, [navigationFade, headerOffsetRight, windowSize.width])

  const handleCloseBurgerMenu = useCallback(() => {
    setBurgerMenuOpened(false)
    modalService.changeModalState('burgerMenu', false)
  }, [windowSize.width])

  const toggleBurgerMenu = useCallback(() => {
    if (burgerMenuOpened) {
      handleCloseBurgerMenu()

      return
    }

    handleOpenBurgerMenu()
  }, [burgerMenuOpened, handleOpenBurgerMenu, handleCloseBurgerMenu])

  useEffect(() => {
    modalService.addActionOnScreenChange('burgerMenu', {
      onCloseMobile() {
        handleCloseBurgerMenu()
        modalService.clearFullFade()
      },
      onCloseDesktop() {
        handleCloseBurgerMenu()
        modalService.clearFullFade()
      },
    })

    modalService.addActionOnScreenChange('searchBar', {
      onCloseMobile() {
        handleCloseSearchBar()
        modalService.clearFade()
      },
      onCloseDesktop() {
        handleCloseSearchBar()
        modalService.clearFade()
      },
    })
  }, [])

  useOnClickOutside(mobileAsideRef, () => {
    if (burgerMenuOpened) {
      handleCloseBurgerMenu()
    }
  })

  useOnClickOutside(navigationRef, () => {
    if (!isMobile && !isTablet && burgerMenuOpened) {
      handleCloseBurgerMenu()
    }

    if (searchBarOpened) {
      handleCloseSearchBar()
    }
  })

  useEffect(() => {
    if (burgerMenuOpened) {
      handleCloseBurgerMenu()
    }

    if (searchBarOpened) {
      const search = searchParams.get('search')?.trim() ?? ''

      if (search) {
        addHistoryItem(search)
      }

      if (searchFieldRef.current) {
        searchFieldRef.current.blur()
      }

      handleCloseSearchBar()
      setStartSearchLoading(false)
      setItemForPush(null)
    }
  }, [pathname, searchParams.toString(), searchFieldRef])

  useEffect(() => {
    const closeAllModals = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      if (burgerMenuOpened) {
        handleCloseBurgerMenu()
      }

      if (searchBarOpened) {
        handleCloseSearchBar()
        searchFieldRef.current?.blur()
      }
    }

    document.addEventListener('keydown', closeAllModals)

    return () => {
      document.removeEventListener('keyup', closeAllModals)
    }
  }, [burgerMenuOpened, searchBarOpened])

  return (
    <div ref={navigationRef}>
      <div className='relative z-30 flex h-full max-h-20 w-full items-center justify-between rounded-[1000px] bg-white px-4 py-[15px] shadow-[0_8px_24px_0_rgba(179,179,179,0.3)] tablet:min-h-20 tablet:px-6 tablet:py-[28px]'>
        <motion.div
          variants={{
            initial: { x: 0, opacity: 1 },
            hide: { x: -15, opacity: 0 },
          }}
          initial='initial'
          animate={showEdgeNavItems ? 'initial' : 'hide'}
          className={clsx('flex items-center gap-4 mobile:gap-5 tablet:gap-6', {
            'pointer-events-none': !showEdgeNavItems,
          })}
        >
          <BurgerMenu
            isOpen={burgerMenuOpened}
            onClick={() => {
              handleCloseSearchBar()
              toggleBurgerMenu()
            }}
          />

          <FocusRing focusRingClass='ring ring-offset-2'>
            <Link
              className='-mt-[3px] h-[30px] w-[86px]'
              href={logoUrl}
              onClick={() => {
                if (burgerMenuOpened) {
                  handleCloseBurgerMenu()
                }
              }}
            >
              <PayloadImage className='h-full w-full' src={logo} />
            </Link>
          </FocusRing>
        </motion.div>

        <SearchField
          ref={searchFieldRef}
          className='absolute left-1/2 hidden -translate-x-[50%] tablet:block'
          search={search}
          onStartLoading={() => setStartSearchLoading(true)}
          isStartLoading={startSearchLoading}
          onFocus={() => {
            handleOpenSearchBar()
          }}
          animationProps={{
            variants: {
              initial: { width: '50%' },
              open: { width: '97%' },
            },
            initial: 'initial',
            animate: showEdgeNavItems ? 'initial' : 'open',
          }}
        />

        <NavItems
          showNavItems={showEdgeNavItems}
          productsInCart={productsInCart}
          links={navLinks}
          onSearchClick={toggleSearchBar}
          onLinkClick={() => {
            if (burgerMenuOpened) {
              handleCloseBurgerMenu()
            }
          }}
        />
      </div>

      <SearchBar
        isOpen={searchBarOpened}
        search={search}
        isStartLoading={startSearchLoading}
        onStartLoading={() => setStartSearchLoading(true)}
        cardLinks={props.navigation.categories.cardLinks}
      />

      <MobileSideBar
        {...props}
        isOpen={burgerMenuOpened}
        ref={mobileAsideRef}
        onClose={handleCloseBurgerMenu}
      />

      <DesktopSideBar {...props} isOpen={burgerMenuOpened} />
    </div>
  )
}
