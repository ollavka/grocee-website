/* eslint-disable no-unused-vars */
'use client'

import {
  ComponentProps,
  forwardRef,
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { BurgerMenu } from '../BurgerMenu'
import { createPortal } from 'react-dom'
import { FocusRing, useIsSSR } from 'react-aria'
import { Close, AccountCircle, ChevronRight } from '@oleksii-lavka/grocee-icons/icons'
import { Navigation } from '../'
import Link from 'next/link'
import { mapIcon } from '@oleksii-lavka/grocee-icons'
import { Carousel as CarouselUI, Card as CardUI, PayloadImage } from 'ui'
import clsx from 'clsx'
import { useWindowSize } from '../../../hooks'

type Props = Pick<ComponentProps<typeof BurgerMenu>, 'isOpen'> &
  Omit<ComponentProps<typeof Navigation>, 'logo' | 'logoUrl' | 'search' | 'navLinks'> & {
    onClose: () => void
  } & Pick<HTMLMotionProps<'aside'>, 'onAnimationComplete'>

type NavigationTab = keyof ComponentProps<typeof Navigation>['navigation']

type DefaultNavigationPanelProps = Omit<
  Props,
  'isOpen' | 'defaultMenuHeader' | 'onClose' | 'backButton'
> & {
  onChangeSelectedTab: (tab: NavigationTab | null) => void
}

type CategoriesNavigationPanelProps = Props['navigation']['categories']

type PromotionsNavigationPanelProps = Props['navigation']['promotions']

type IntegrationNavigationPanelProps = Props['navigation']['integration']

export const MobileSideBar = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    isOpen,
    defaultMenuHeader,
    helpNavigation,
    accountField,
    navigation,
    support,
    onClose,
    backButton,
    onAnimationComplete,
  } = props

  const isSSR = useIsSSR()
  const { isLaptop, isDesktop } = useWindowSize()
  const body = useRef<Element | null>(null)

  const [selectedTab, setSelectedTab] = useState<NavigationTab | null>(null)

  const onChangeSelectedTab = useCallback(
    (tab: NavigationTab | null) => {
      if (tab === selectedTab) {
        return
      }

      setSelectedTab(tab)
    },
    [selectedTab],
  )

  const navigationTab = useMemo(() => {
    if (!selectedTab) {
      return {
        title: defaultMenuHeader,
      }
    }

    const [, foundTab] = Object.entries(navigation).find(([tab]) => tab === selectedTab)!

    return typeof foundTab === 'string' ? { title: defaultMenuHeader } : foundTab
  }, [selectedTab, defaultMenuHeader, navigation])

  const mappedBackButton = useMemo(() => {
    if (!backButton.icon.icon) {
      return null
    }

    const Icon = mapIcon(backButton.icon.icon)

    if (!Icon) {
      return null
    }

    return (
      <FocusRing focusRingClass='ring ring-offset-2'>
        <button
          onClick={() => {
            onChangeSelectedTab(null)
          }}
          tabIndex={0}
          className='gilroy-md absolute top-full mt-2 flex items-center gap-2 border-none bg-transparent font-light text-gray-600 outline-none'
        >
          <Icon width={backButton.icon.size.width} height={backButton.icon.size.height} />
          <span>{backButton.label}</span>
        </button>
      </FocusRing>
    )
  }, [backButton, onChangeSelectedTab])

  useEffect(() => {
    body.current = document.body
  }, [])

  useEffect(() => {
    if (isOpen) {
      return
    }

    onChangeSelectedTab(null)
  }, [isOpen])

  const animationOptions: HTMLMotionProps<any> = useMemo(() => {
    const translateX = selectedTab ? -50 : 50

    return {
      initial: { x: translateX, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: translateX, opacity: 0 },
      transition: { duration: 0.3 },
    }
  }, [selectedTab])

  const navigationPanels = useMemo(() => {
    const navigationProps = {
      default: {
        accountField,
        helpNavigation,
        navigation,
        onChangeSelectedTab,
        support,
      },
      ...navigation,
    }

    const navigationPanels = {
      default: DefaultNavigationPanel,
      categories: CategoriesNavigationPanel,
      promotions: PromotionsNavigationPanel,
      integration: IntegrationNavigationPanel,
    }

    const NavigationPanel = navigationPanels[selectedTab || 'default']
    const currentNavigationProps = navigationProps[selectedTab || 'default']

    return (
      <motion.div
        key={navigationTab.title}
        className={clsx('flex grow flex-col', {
          'pt-6': !!selectedTab,
        })}
        {...animationOptions}
      >
        {/* @ts-ignore */}
        <NavigationPanel {...currentNavigationProps} />
      </motion.div>
    )
  }, [selectedTab, navigationTab, navigation, animationOptions, helpNavigation, accountField])

  if (isSSR || isLaptop || isDesktop || !body.current) {
    return null
  }

  return createPortal(
    <motion.aside
      ref={ref}
      aria-label='mobile-main-navigation'
      animate={isOpen ? 'opened' : 'closed'}
      initial='closed'
      transition={{
        type: 'spring',
        duration: 0.7,
      }}
      variants={{
        opened: {
          opacity: 1,
          scaleX: 1,
          pointerEvents: 'all',
        },
        closed: {
          opacity: 0,
          scaleX: 0,
          pointerEvents: 'none',
        },
      }}
      onAnimationComplete={onAnimationComplete}
      className='fixed bottom-0 left-0 top-0 z-30 flex w-full origin-left flex-col overflow-y-auto overflow-x-hidden bg-white p-4 min-[375px]:max-w-[325px]'
    >
      <header className='mb-6 flex justify-between'>
        <AnimatePresence mode='wait'>
          <motion.div className='relative' key={navigationTab.title} {...animationOptions}>
            <h2 className='gilroy-lg relative grow text-gray-900'>{navigationTab.title}</h2>
            {selectedTab && mappedBackButton && mappedBackButton}
          </motion.div>
        </AnimatePresence>

        <FocusRing focusRingClass='ring ring-offset-2'>
          <button
            aria-label='Close main menu'
            onClick={onClose}
            className='flex cursor-pointer flex-col items-center justify-center border-none bg-transparent p-[6px] outline-none transition-colors duration-300 hover:text-gray-700'
          >
            <Close size={12} />
          </button>
        </FocusRing>
      </header>

      <AnimatePresence mode='wait'>{navigationPanels}</AnimatePresence>
    </motion.aside>,
    body.current as HTMLElement,
    'mobile-main-navigation',
  )
})

function DefaultNavigationPanel({
  accountField,
  helpNavigation,
  navigation,
  onChangeSelectedTab,
  support,
}: DefaultNavigationPanelProps) {
  return (
    <>
      <FocusRing focusRingClass='ring ring-offset-2'>
        <Link
          href={accountField?.mainMenuAccountField?.link ?? ''}
          className='mb-6 flex select-none justify-between gap-2 rounded-lg bg-gray-50 p-2'
        >
          <AccountCircle size={28} className='p-[3px] text-gray-900' />

          <div className='flex grow flex-col gap-1'>
            <span className='gilroy-lg text-gray-900'>
              {accountField?.mainMenuAccountField?.title}
            </span>
            <span className='gilroy-xs font-light text-gray-600'>
              {accountField?.mainMenuAccountField?.description}
            </span>
          </div>

          <ChevronRight width={9} height={28} className='mr-[8px]' />
        </Link>
      </FocusRing>

      <nav className='mb-4 border-b-[1px] border-gray-100 pb-4'>
        <ul className='flex flex-col gap-2'>
          {Object.entries(navigation).map(([key, navItem]) => {
            const navKey = key as NavigationTab
            const Icon = mapIcon(navItem.icon.icon)

            return (
              <li aria-label='nav-selector' key={navKey}>
                <FocusRing focusRingClass='ring ring-offset-2'>
                  <button
                    className='flex select-none items-center gap-2 border-none bg-transparent px-3 py-2 outline-none'
                    onClick={() => onChangeSelectedTab(navKey)}
                  >
                    {Icon && (
                      <Icon width={navItem.icon.size.width} height={navItem.icon.size.height} />
                    )}
                    <span className='gilroy-sm grow text-gray-900'>{navItem.title}</span>
                    <ChevronRight width={6} height={12} className='mr-[8px]' />
                  </button>
                </FocusRing>
              </li>
            )
          })}
        </ul>
      </nav>

      <section className='flex grow flex-col justify-between gap-16'>
        <nav>
          <ul className='flex flex-col gap-2'>
            {helpNavigation.map(({ id, label, link }) => (
              <FocusRing focusRingClass='ring ring-offset-2' key={id}>
                <Link href={link} className='gilroy-sm select-none px-3 py-1 text-gray-900'>
                  {label}
                </Link>
              </FocusRing>
            ))}
          </ul>
        </nav>
        <div className='rounded-lg bg-gray-50 p-2'>
          <ul className='flex flex-col gap-4'>
            {(support?.links ?? []).map(({ id, caption, href, info, icon }) => {
              const Icon = mapIcon(icon?.icon ?? null)

              return (
                <li className='flex items-center gap-2' key={id}>
                  <FocusRing focusRingClass='ring ring-offset-2'>
                    <Link href={href} className='flex w-full gap-2 no-underline' target='_blank'>
                      {Icon && (
                        <div className='p-[6px]'>
                          <Icon size={12} className='text-success-500' />
                        </div>
                      )}
                      <div className='flex flex-col gap-1'>
                        <span className='gilroy-xs text-gray-900'>{info}</span>
                        <span className='gilroy-xs font-light text-gray-600'>{caption}</span>
                      </div>
                    </Link>
                  </FocusRing>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}

function CategoriesNavigationPanel({ cardLinks, commonLinks }: CategoriesNavigationPanelProps) {
  const mappedCardLinks = cardLinks.map(({ id, image, link, text, gap }, idx) => (
    <CardUI key={`${id}-${idx}`} href={link} text={text} image={image} gap={gap ?? undefined} />
  ))

  return (
    <nav>
      <div className='mb-6 border-b-[1px] border-gray-100 pb-6'>
        <CarouselUI
          className='!p-2'
          slideClassName='mr-6 max-w-[212px] tablet:max-w-[292px]'
          disableWidthLimit
          speed={500}
          disableLink
          disableNavigationButtons
        >
          {mappedCardLinks}
        </CarouselUI>
      </div>

      <ul className='flex flex-col gap-2'>
        {commonLinks.map(({ id, label, link }) => (
          <FocusRing key={id} focusRingClass='ring ring-offset-2'>
            <Link className='gilroy-sm text-gray-700' href={link}>
              {label}
            </Link>
          </FocusRing>
        ))}
      </ul>
    </nav>
  )
}

function PromotionsNavigationPanel({ cardLinks }: PromotionsNavigationPanelProps) {
  return (
    <nav>
      <ul className='flex flex-col gap-2'>
        {cardLinks.map(({ id, image, link, text, gap }, idx) => (
          <li key={`${id}-${idx}`}>
            <CardUI href={link} text={text} image={image} gap={gap ?? undefined} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function IntegrationNavigationPanel({ logos }: IntegrationNavigationPanelProps) {
  return (
    <div>
      <ul className='flex flex-col gap-6'>
        {logos.map(({ id, logo }, idx) => (
          <li className='inline-block max-w-fit' key={`${id}${idx}`}>
            <PayloadImage src={logo} className='h-[34px]' />
          </li>
        ))}
      </ul>
    </div>
  )
}
