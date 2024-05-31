'use client'

import { BottomNavigation, Image as PayloadImageType } from 'cms-types'
import Link from 'next/link'
import { FC } from 'react'
import { FocusRing } from 'react-aria'
import { Button, Input, PayloadImage } from '../..'

type Props = Pick<BottomNavigation, 'footerInfo' | 'subscribeSection'> & {
  logo: {
    image: PayloadImageType
    url: string
    caption: string
  }
  navGroups: {
    title: string
    links: {
      id: string
      page: string
      label: string
    }[]
  }[]
}

export const Footer: FC<Props> = ({ logo, navGroups, subscribeSection, footerInfo }) => {
  return (
    <div className='mx-auto max-w-[1240px]'>
      <div className='grid-layout !gap-y-6 border-b-[1px] border-gray-800 pb-8'>
        <div className='col-span-full flex flex-col gap-6 laptop:col-span-3'>
          <FocusRing focusRingClass='ring ring-offset-2'>
            <Link className='mt-[-3px] max-h-[30px] max-w-[86px]' href={logo.url}>
              <PayloadImage src={logo.image} className='h-[30px] max-w-[86px]' />
            </Link>
          </FocusRing>

          <span className='gilroy-sm font-light text-gray-100'>{logo.caption}</span>
        </div>

        <div className='col-span-6 grid grid-cols-4 gap-x-4 gap-y-6 tablet:grid-cols-4 tablet:gap-x-8 laptop:col-span-9 laptop:grid-cols-8'>
          <nav className='col-span-full grid grid-cols-2 gap-6 tablet:col-span-2 laptop:col-span-4'>
            {navGroups.map(({ title, links }) => (
              <div className='col-span-1 flex flex-col gap-4' key={title}>
                <h5 className='gilroy-sm text-white'>{title}</h5>
                <ul className='flex flex-col gap-2'>
                  {links.map(({ id, page, label }) => (
                    <li key={id}>
                      <FocusRing focusRingClass='ring ring-offset-2'>
                        <Link
                          href={page}
                          className='gilroy-sm font-light text-gray-200 no-underline transition-colors duration-300 ease-in-out hover:text-gray-400'
                        >
                          {label}
                        </Link>
                      </FocusRing>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className='col-span-full flex flex-col gap-4 tablet:col-span-2 laptop:col-span-4'>
            <h5 className='gilroy-sm text-white'>{subscribeSection.title}</h5>
            <Input
              type='email'
              inputClassName='!text-white placeholder:text-gray-400'
              placeholder={subscribeSection.textField.placeholder}
              aria-label='subscribe'
              innerClassName='!py-0 !pr-0'
              trailingComplex={{
                end: (
                  <Button standartButton variant='tertiary'>
                    {subscribeSection.textField.subscribeButtonLabel}
                  </Button>
                ),
                disableDivider: true,
              }}
            />
          </div>
        </div>
      </div>

      <div className='gilroy-sm flex flex-col items-center gap-2 py-8 font-light text-gray-100 tablet:flex-row tablet:justify-between'>
        <span>{footerInfo.rightsText}</span>
        {footerInfo.designedBy && <span>{footerInfo.designedBy}</span>}
      </div>
    </div>
  )
}
