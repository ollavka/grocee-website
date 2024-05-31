import './globals.css'

import { ReactNode } from 'react'
import { getMetadata, getGlobal } from '@/cms'
import { cookies } from 'next/headers'
import { useGlobalTypography } from '@/store'
import SetupClientComponent from '@/components/SetupClientComponent'
import MainNavigation from '@/cms/globals/MainNavigation'
import BottomNavigation from '@/cms/globals/BottomNavigation'
import { Providers } from '@/components/Providers'
import NextTopLoader from 'nextjs-toploader'
import { ClientProviders } from '@/components/ClientProviders'

export async function generateMetadata() {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('pages', 'home', { searchParams: { locale } })
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const locale = cookies().get('locale')?.value ?? 'en'

  const [globalTypography, mainNavigation, bottomNavigation] = await Promise.all([
    getGlobal('globalTypography', { searchParams: { depth: '1', locale } }),
    getGlobal('mainNavigation', { searchParams: { depth: '1', locale } }),
    getGlobal('bottomNavigation', { searchParams: { depth: '1', locale } }),
  ])

  useGlobalTypography.setState(globalTypography)

  return (
    <html lang={locale}>
      <body className='overflow-x-hidden bg-white desktop:mb-10'>
        <Providers>
          <ClientProviders>
            <NextTopLoader color='#5E5E5E' height={4} initialPosition={0.3} showSpinner={false} />
            <div className='burgermenu-bottom-modal-fade-container pointer-events-none fixed inset-0 w-screen bg-gray-900 opacity-0 transition-opacity duration-1000' />
            <div className='searchbar-fade-container pointer-events-none fixed inset-0 w-screen bg-gray-900 opacity-0 transition-opacity duration-1000' />
            <div className='sidebar-fade-container pointer-events-none fixed inset-0 w-screen bg-gray-900 opacity-0 transition-opacity duration-1000' />
            <SetupClientComponent globalTypography={globalTypography} />
            <MainNavigation {...mainNavigation} />
            <div className='mx-auto flex min-h-full max-w-[1440px] flex-col'>
              <main className='grow laptop:mt-8'>{children}</main>
              <BottomNavigation {...bottomNavigation} />
            </div>
          </ClientProviders>
        </Providers>
      </body>
    </html>
  )
}
