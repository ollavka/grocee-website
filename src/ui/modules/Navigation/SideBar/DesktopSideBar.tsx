'use client'

import { ComponentProps, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { FocusRing, useIsSSR } from 'react-aria'
import { useWindowSize } from '../../../hooks'
import { Navigation } from '..'
import { mapIcon } from '@oleksii-lavka/grocee-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { Carousel as CarouselUI, Card as CardUI, PayloadImage } from 'ui'

type Props = Pick<
  ComponentProps<typeof Navigation>,
  'helpNavigation' | 'support' | 'navigation'
> & {
  isOpen?: boolean
} & Pick<HTMLMotionProps<'aside'>, 'onAnimationComplete'>

type NavigationTab = keyof Props['navigation']

type CategoriesNavigationPanelProps = Props['navigation']['categories']

type PromotionsNavigationPanelProps = Props['navigation']['promotions'] & {
  asideHeight: number | null
}

type IntegrationNavigationPanelProps = Props['navigation']['integration'] & {
  asideHeight: number | null
}

export const DesktopSideBar: FC<Props> = ({
  navigation,
  helpNavigation,
  isOpen,
  onAnimationComplete,
}) => {
  const isSSR = useIsSSR()
  const { isMobile, isTablet } = useWindowSize()
  const asideRef = useRef<HTMLElement | null>(null)

  const [selectedTab, setSelectedTab] = useState<NavigationTab>('categories')

  const asideHeight = useMemo(() => {
    if (!asideRef.current || !isOpen) {
      return null
    }

    return asideRef.current.clientHeight
  }, [asideRef, selectedTab, isOpen])

  const onChangeSelectedTab = useCallback(
    (tab: NavigationTab) => {
      if (tab === selectedTab) {
        return
      }

      setSelectedTab(tab)
    },
    [selectedTab],
  )

  const navigationPanels = useMemo(() => {
    const NavigationPanel = {
      categories: CategoriesNavigationPanel,
      promotions: PromotionsNavigationPanel,
      integration: IntegrationNavigationPanel,
    }[selectedTab as keyof Props['navigation']]

    const navigationProps = navigation[selectedTab as keyof Props['navigation']]

    // @ts-ignore
    return <NavigationPanel {...navigationProps} asideHeight={asideHeight} />
  }, [selectedTab, navigation, helpNavigation])

  useEffect(() => {
    if (isOpen) {
      return
    }

    onChangeSelectedTab('categories')
  }, [isOpen])

  if (isSSR || isMobile || isTablet) {
    return null
  }

  return (
    <motion.aside
      animate={isOpen ? 'opened' : 'closed'}
      initial='closed'
      transition={{
        type: 'spring',
        duration: 0.7,
      }}
      variants={{
        opened: {
          opacity: 1,
          scaleY: 1,
          pointerEvents: 'all',
        },
        closed: {
          opacity: 0,
          scaleY: 0,
          pointerEvents: 'none',
        },
      }}
      onAnimationComplete={onAnimationComplete}
      className='absolute left-0 right-0 top-0 z-20 origin-top rounded-b-2xl rounded-t-[50px] bg-white px-6 pb-6 pt-[120px]'
    >
      <motion.nav ref={asideRef} className='grid grid-cols-4 gap-4'>
        <div className='col-span-1'>
          <ul className='mb-4 flex flex-col gap-2 border-b-[1px] border-gray-100 pb-4'>
            {Object.entries(navigation).map(([key, navItem]) => {
              const navKey = key as NavigationTab

              const Icon = mapIcon(navItem.icon.icon)

              return (
                <li aria-label='nav-selector' key={navKey}>
                  <FocusRing focusRingClass='ring ring-offset-2'>
                    <button
                      className={clsx(
                        'relative flex select-none items-center gap-2 rounded-full border-none bg-transparent px-3 py-2 outline-none transition-colors duration-300 hover:bg-gray-100',
                        {
                          'text-gray-900': navKey !== selectedTab,
                          'text-white': navKey === selectedTab,
                        },
                      )}
                      onClick={() => onChangeSelectedTab(navKey)}
                    >
                      {navKey === selectedTab && isOpen && (
                        <motion.div
                          layoutId='activeTab'
                          className='absolute inset-0 bg-gray-900 transition-colors duration-300'
                          style={{ borderRadius: 9999 }}
                        />
                      )}

                      {Icon && (
                        <Icon
                          width={navItem.icon.size.width}
                          height={navItem.icon.size.height}
                          className='relative'
                        />
                      )}
                      <span className='gilroy-sm relative grow'>{navItem.title}</span>
                    </button>
                  </FocusRing>
                </li>
              )
            })}
          </ul>
          <ul className='flex flex-col gap-2'>
            {helpNavigation.map(({ id, label, link }) => (
              <FocusRing focusRingClass='ring ring-offset-2' key={id}>
                <Link
                  href={link}
                  className='gilroy-sm select-none px-3 py-1 text-gray-900 transition-colors duration-300 hover:text-gray-600'
                >
                  {label}
                </Link>
              </FocusRing>
            ))}
          </ul>
        </div>

        <div className='col-span-3'>
          <AnimatePresence mode='wait'>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={selectedTab}
              className='h-full'
            >
              {navigationPanels}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.nav>
    </motion.aside>
  )
}

function CategoriesNavigationPanel({ cardLinks, commonLinks }: CategoriesNavigationPanelProps) {
  const mappedCardLinks = cardLinks.map(({ id, image, link, text, gap }, idx) => (
    <CardUI
      className='max-h-[124px] !p-2'
      imageContainerClassName='!min-h-16'
      key={`${id}-${idx}`}
      href={link}
      text={text}
      image={image}
      gap={gap ?? undefined}
    />
  ))

  return (
    <div>
      <div className='mb-4 border-b-[1px] border-gray-100 pb-5'>
        <CarouselUI
          disableWidthLimit
          speed={500}
          slideClassName='mr-6 max-w-[212px]'
          disableLink
          disableNavigationButtons
          breakpoints={{
            laptop: {
              slidesPerView: 'auto',
            },
          }}
        >
          {mappedCardLinks}
        </CarouselUI>
      </div>
      <ul className='grid grid-cols-3 gap-x-6 gap-y-2 desktop:grid-cols-4'>
        {commonLinks.map(({ id, label, link }) => (
          <FocusRing key={id} focusRingClass='ring ring-offset-2'>
            <Link className='gilroy-sm col-span-1 text-gray-700' href={link}>
              {label}
            </Link>
          </FocusRing>
        ))}
      </ul>
    </div>
  )
}

function PromotionsNavigationPanel({ cardLinks, asideHeight }: PromotionsNavigationPanelProps) {
  const mappedCardLinks = cardLinks.map(({ id, image, link, text, gap }, idx) => (
    <CardUI
      className='!min-h-full justify-between !p-2'
      imageContainerClassName='!min-h-0'
      imageContainerStyle={{
        height: asideHeight !== null ? asideHeight - 80 : 'auto',
        maxHeight: asideHeight !== null ? asideHeight - 80 : 'auto',
      }}
      key={`${id}-${idx}`}
      href={link}
      text={text}
      image={image}
      gap={gap ?? undefined}
    />
  ))

  return (
    <CarouselUI
      disableWidthLimit
      speed={500}
      slideClassName='max-w-[230px]'
      innerContainerClassName='flex'
      disableLink
      disableNavigationButtons
      breakpoints={{
        laptop: {
          slidesPerView: 'auto',
        },
      }}
    >
      {mappedCardLinks}
    </CarouselUI>
  )
}

function IntegrationNavigationPanel({ logos, asideHeight }: IntegrationNavigationPanelProps) {
  return (
    <div style={{ height: asideHeight ?? 'auto' }}>
      <ul className='flex flex-wrap gap-6'>
        {logos.map(({ id, logo }, idx) => (
          <li className='inline-block max-w-fit' key={`${id}${idx}`}>
            <PayloadImage src={logo} className='h-[34px]' />
          </li>
        ))}
      </ul>
    </div>
  )
}
