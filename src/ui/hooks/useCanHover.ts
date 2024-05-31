'use client'
import { useEffect, useState } from 'react'

export const useCanHover = () => {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    if (!window) {
      return
    }

    setCanHover(!window.matchMedia('(hover: none)').matches)

    const mediaQuery: MediaQueryList = window.matchMedia('(hover: none)')

    const handler = (event: MediaQueryListEvent) => {
      setCanHover(!event.matches)
    }

    mediaQuery.addListener(handler)

    return () => {
      mediaQuery.removeListener(handler)
    }
  }, [])

  return canHover
}
