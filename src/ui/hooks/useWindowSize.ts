import { useThrottle } from '@react-hook/throttle'
import { useLayoutEffect, useRef, useState } from 'react'
import { singletonHook } from 'react-singleton-hook'

import modalService, { ModalStates } from '../service/modalService'

type WindowSize = {
  width: number
  height: number
}

type WindowSizeProps = {
  windowSize: WindowSize
  isDesktop: boolean
  isLaptop: boolean
  isTablet: boolean
  isMobile: boolean
}

export const useWindowSize = singletonHook<WindowSizeProps>(
  {
    windowSize: { width: 0, height: 0 },
    isDesktop: false,
    isLaptop: false,
    isTablet: false,
    isMobile: false,
  },
  () => {
    const [isDesktop, setIsDesktop] = useState(false)
    const [isLaptop, setIsLaptop] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [windowSize, setWindowSize] = useThrottle<WindowSize>({ width: 0, height: 0 }, 4)

    const previousLaptopState = useRef<boolean>()
    const previousTabletState = useRef<boolean>()
    const previousDesktopState = useRef<boolean>()

    const closeModals = (isMathchNotMobile: boolean, modalStates: ModalStates) => {
      if (isMathchNotMobile) {
        Object.entries(modalStates).forEach(([key, { onCloseDesktop }]) => {
          if (onCloseDesktop) {
            onCloseDesktop()
            modalService.changeModalState(key as keyof typeof modalStates, false)
          }
        })
      } else {
        Object.entries(modalStates).forEach(([key, { onCloseMobile }]) => {
          if (onCloseMobile) {
            onCloseMobile()
            modalService.changeModalState(key as keyof typeof modalStates, false)
          }
        })
      }
    }

    useLayoutEffect(() => {
      const handleResize = () => {
        const windowWidth = window.innerWidth

        const isMatchTablet = windowWidth >= 768 && windowWidth < 1024
        const isMatchLaptop = windowWidth >= 1024 && windowWidth < 1280
        const isMatchDesktop = windowWidth >= 1280

        // Only trigger modals handle when window type changed
        if (isMatchDesktop !== previousDesktopState.current) {
          const modalStates = modalService.getModalStates()

          previousDesktopState.current = isMatchDesktop

          setIsDesktop(isMatchDesktop)

          closeModals(isMatchDesktop, modalStates)
        }

        if (isMatchLaptop !== previousLaptopState.current) {
          const modalStates = modalService.getModalStates()

          previousLaptopState.current = isMatchLaptop

          setIsLaptop(isMatchLaptop)

          closeModals(isMatchLaptop, modalStates)
        }

        if (isMatchTablet !== previousTabletState.current) {
          const modalStates = modalService.getModalStates()

          previousTabletState.current = isMatchTablet

          setIsTablet(isMatchTablet)

          closeModals(isMatchTablet, modalStates)
        }

        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }

      window.addEventListener('resize', handleResize)

      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
      windowSize,
      isDesktop,
      isTablet,
      isLaptop,
      isMobile: !isDesktop && !isTablet && !isLaptop,
    }
  },
)
