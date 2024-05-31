/* eslint-disable no-unused-vars */
'use client'

import { MainNavigation } from 'cms-types'
import { FC } from 'react'
import { Reset, CloseCircle } from '@oleksii-lavka/grocee-icons/icons'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useSearchHistory } from 'store'
import { FocusRing } from 'react-aria'
import { SearchField } from './SearchField'
import { MappedCard } from '../../../types'
import { Card as CardUI, Carousel as CarouselUI } from 'ui'

type Props = Pick<MainNavigation['header'], 'search'> & {
  isOpen: boolean
  onStartLoading: () => void
  isStartLoading: boolean
  cardLinks: MappedCard[]
} & Pick<HTMLMotionProps<'aside'>, 'onAnimationComplete'>

export const SearchBar: FC<Props> = ({
  search,
  isOpen,
  isStartLoading,
  onStartLoading,
  onAnimationComplete,
  cardLinks,
}) => {
  const { history, removeHistoryItem, setItemForPush } = useSearchHistory()

  const mappedCardLinks = cardLinks.map(({ id, image, link, text, gap }, idx) => (
    <CardUI
      className='!p-2'
      imageContainerClassName='h-20'
      key={`${id}-${idx}`}
      href={link}
      text={text}
      image={image}
      gap={gap ?? undefined}
    />
  ))

  return (
    <motion.aside
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
      className='absolute left-0 right-0 top-0 z-20 origin-top rounded-b-2xl rounded-t-[40px] bg-white px-4 pb-4 pt-[78px] tablet:px-6 tablet:pt-[100px]'
    >
      <SearchField
        className='tablet:hidden'
        isStartLoading={isStartLoading}
        onStartLoading={onStartLoading}
        search={search}
      />

      <AnimatePresence>
        {history.length > 0 ? (
          <motion.ul
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className='mt-6 flex flex-col gap-2.5 border-gray-100 pb-4 laptop:mb-4 laptop:border-b-[1px]'
          >
            <AnimatePresence initial={false}>
              {history.map(({ id, text }) => (
                <motion.li
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                  }}
                  key={id}
                  className='flex items-center gap-2'
                >
                  <FocusRing focusRingClass='ring ring-offset-2'>
                    <>
                      <button
                        onClick={() => setItemForPush(text)}
                        className='border-none bg-transparent outline-none'
                      >
                        <Reset size={24} className='p-1 text-gray-900' />
                      </button>
                      <span className='gilroy-sm grow text-gray-700'>{text}</span>
                      <button
                        onClick={() => removeHistoryItem(id)}
                        className='border-none bg-transparent outline-none'
                      >
                        <CloseCircle size={24} className='p-1 text-gray-900' />
                      </button>
                    </>
                  </FocusRing>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='gilroy-md mt-6 text-balance border-gray-100 pb-4 text-center text-gray-900 laptop:mb-4 laptop:border-b-[1px]'
          >
            {search.emptySearchHistoryLabel}
          </motion.p>
        )}
      </AnimatePresence>

      <div className='hidden laptop:block'>
        <CarouselUI
          disableWidthLimit
          speed={500}
          slideClassName='mr-6 max-w-[212px] tablet:max-w-[292px]'
          disableLink
          disableNavigationButtons
        >
          {mappedCardLinks}
        </CarouselUI>
      </div>
    </motion.aside>
  )
}
