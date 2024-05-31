'use client'

import { GlobalTypography } from 'cms-types'
import { useEffect } from 'react'
import { useGlobalTypography, useSearchHistory, usePrevPath, useShoppingBasket } from '@/store'
import { usePathname, useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

type SetupClientComponentProps = {
  globalTypography: GlobalTypography
}

const SetupClientComponent = ({ globalTypography }: SetupClientComponentProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { updatePrevPath } = usePrevPath()

  useEffect(() => {
    useGlobalTypography.setState(globalTypography)
    useSearchHistory.persist.rehydrate()
    usePrevPath.persist.rehydrate()
    useShoppingBasket.persist.rehydrate()
  }, [globalTypography])

  useEffect(() => {
    const search = searchParams.get('search')

    if (!search) {
      updatePrevPath(pathname)
    }
  }, [pathname, searchParams])

  return (
    <Toaster
      position='top-center'
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        success: {
          duration: 3000,
        },
      }}
    />
  )
}

export default SetupClientComponent
