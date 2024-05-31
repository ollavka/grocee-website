import 'react-loading-skeleton/dist/skeleton.css'

import { FC, PropsWithChildren } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { CookiesProvider } from 'next-client-cookies/server'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <CookiesProvider>
      <SkeletonTheme baseColor='#C6C6C6' highlightColor='#EBEBEB'>
        {children}
      </SkeletonTheme>
    </CookiesProvider>
  )
}
