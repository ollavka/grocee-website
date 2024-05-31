import { useEffect, useState } from 'react'

/**
 * Hook that returns whether the code is running on the server or not.
 * Also exposes handy functions that can be used to run code only on the server or only on the client.
 */
export const useSSR = () => {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    setIsSSR(false)
  }, [])

  return {
    isServer: isSSR,
    onServer: <T>(fn: () => T) => (isSSR ? fn() : undefined),
    isClient: !isSSR,
    onClient: <T>(fn: () => T) => (!isSSR ? fn() : undefined),
  }
}
