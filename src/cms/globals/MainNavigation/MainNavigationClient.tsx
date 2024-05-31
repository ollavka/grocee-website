'use client'

import { ComponentProps, useMemo, useRef } from 'react'
import { Navigation } from 'ui'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useWindowSize } from 'ui/hooks'
import clsx from 'clsx'
import { useSSR } from '@/hooks'
import { useEdgeBlocksOnPage, useGlobalTypography, useShoppingBasket } from '@/store'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { AllIconNames } from '@oleksii-lavka/grocee-icons'

type Props = Omit<ComponentProps<typeof Navigation>, 'support' | 'accountField' | 'backButton'>

export function MainNavigationClient(props: Props) {
  const { isServer } = useSSR()
  const headerRef = useRef<HTMLElement>(null)
  const scrollOffset = useRef(0)
  const { account, support, backButton } = useGlobalTypography()
  const { lineItems } = useShoppingBasket()
  const { firstBlockOnPage } = useEdgeBlocksOnPage()

  const { scrollY } = useScroll()
  const { isTablet, isLaptop, isMobile } = useWindowSize()

  const headerHasOffsetTop = useMemo(
    () => firstBlockOnPage === 'Banner' || firstBlockOnPage === 'MainSlider',
    [firstBlockOnPage],
  )

  const lineItemsCount = useMemo(() => {
    if (!lineItems.length) {
      return
    }

    const count = lineItems.reduce((acc, lineItem) => {
      return acc + (lineItem.quantity ?? 1)
    }, 0)

    return count
  }, [lineItems])

  const { headerOffsetTop, minusOffset } = useMemo(() => {
    const offsetTop = {
      mobile: 32,
      tablet: 32,
      laptop: 64,
    }

    const minusOffset = {
      mobile: 32,
      tablet: 32,
      laptop: headerHasOffsetTop ? 96 : 64,
    }

    const currentDevice = isMobile ? 'mobile' : isTablet ? 'tablet' : 'laptop'

    return {
      headerOffsetTop: offsetTop[currentDevice],
      minusOffset: minusOffset[currentDevice],
    }
  }, [isTablet, isLaptop, headerHasOffsetTop, isMobile])

  const transform = useTransform(scrollY, scrollPosition => {
    if (
      !headerRef.current ||
      scrollPosition < (headerOffsetTop + headerRef.current.clientHeight) / 6
    ) {
      return 'translateY(0)'
    }

    if (scrollPosition > scrollOffset.current) {
      scrollOffset.current = scrollPosition

      return 'translateY(-200%)'
    }

    scrollOffset.current = scrollPosition

    return `translateY(${headerOffsetTop - minusOffset}px)`
  })

  const mappedSupport = useMemo(() => {
    if (!support) {
      return null
    }

    const links = (support?.links ?? []).map(
      ({ type, caption, info, googleMapsLocation, id, icon }) => {
        const href =
          type === 'email'
            ? `mailto:${info}`
            : type === 'phone'
              ? `tel:${info}`
              : googleMapsLocation

        return {
          id: id!,
          caption: caption!,
          href: href ?? '',
          info: info ?? '',
          icon: {
            icon: icon.icon as AllIconNames,
            size: icon.size,
          },
        }
      },
    )

    return {
      links,
    }
  }, [support])

  const mappedAccountField = useMemo(() => {
    if (!account) {
      return null
    }

    return {
      mainMenuAccountField: {
        ...account?.mainMenuAccountField,
        link: parsePayloadLink(account?.mainMenuAccountField?.link),
      },
    }
  }, [account])

  const mappedBackButton = {
    ...backButton,
    icon: {
      icon: backButton.icon.icon as AllIconNames,
      size: backButton.icon.size,
    },
  }

  return (
    <motion.header
      style={{ transform }}
      ref={headerRef}
      className={clsx(
        'main-header-navigation',
        'fixed left-4 right-4 top-8 z-10 mx-auto max-h-20 bg-transparent transition-transform duration-300 ease-in-out',
        'tablet:left-5 tablet:right-5',
        {
          'max-w-[1240px] laptop:left-12 laptop:right-12 laptop:top-16 desktop:left-[100px] desktop:right-[100px]':
            headerHasOffsetTop || isServer,
          'max-w-[1376px] laptop:left-8 laptop:right-8 laptop:top-8': !headerHasOffsetTop,
        },
      )}
    >
      <Navigation
        {...props}
        backButton={mappedBackButton}
        accountField={mappedAccountField}
        support={mappedSupport}
        productsInCart={lineItemsCount}
      />
    </motion.header>
  )
}
