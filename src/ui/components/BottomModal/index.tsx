/* eslint-disable no-unused-vars */
'use client'

import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { createPortal } from 'react-dom'
import { useIsSSR } from 'react-aria'
import { useOnClickOutside } from 'usehooks-ts'
import modalService from '../../service/modalService'
import { useWindowSize } from '../../hooks'

type Props = {
  isOpen: boolean
  onClose: () => void
  className?: string
  modalKey?: string
  onChangeStartOpenAnimation?: (value: boolean) => void
} & PropsWithChildren

export const BottomModal: FC<Props> = ({
  children,
  modalKey = '',
  className = '',
  isOpen,
  onClose,
  onChangeStartOpenAnimation,
}) => {
  const body = useRef<Element | null>(null)
  const isSSR = useIsSSR()
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const { isDesktop, isLaptop, isMobile, isTablet } = useWindowSize()

  useEffect(() => {
    onClose()
    modalService.clearFullFade()
  }, [isDesktop, isLaptop, isMobile, isTablet])

  useEffect(() => {
    modalService.addActionOnScreenChange('bottomModal', {
      onCloseDesktop: () => {
        onClose()
        modalService.clearFullFade()
      },
      onCloseMobile: () => {
        onClose()
        modalService.clearFullFade()
      },
    })
  }, [onClose, modalService])

  useOnClickOutside(modalRef, () => {
    if (isOpen) {
      onClose()
    }
  })

  useEffect(() => {
    body.current = document.body
  }, [])

  if (isSSR || !body.current) {
    return null
  }

  return createPortal(
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.dialog
          onAnimationStart={() => onChangeStartOpenAnimation?.(true)}
          onAnimationComplete={() => onChangeStartOpenAnimation?.(false)}
          animate={isOpen ? 'open' : 'closed'}
          exit='closed'
          variants={{
            closed: {
              scaleY: 0,
              opacity: 0,
            },
            open: {
              scaleY: 1,
              opacity: 1,
            },
          }}
          transition={{
            type: 'spring',
            duration: 0.7,
          }}
          initial='closed'
          ref={modalRef}
          className={clsx(
            'fixed bottom-0 left-0 right-0 z-30 block w-full origin-bottom rounded-t-[16px] px-4 pb-10',
            className,
          )}
        >
          <div className='mx-auto mb-6 mt-4 h-1 w-[52px] rounded-[1000px] bg-gray-300' />
          <div>{children}</div>
        </motion.dialog>
      )}
    </AnimatePresence>,
    body.current as HTMLElement,
    modalKey,
  )
}
