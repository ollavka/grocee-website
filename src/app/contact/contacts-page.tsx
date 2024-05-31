'use client'

import { FC, useMemo } from 'react'
import { useGlobalTypography } from '@/store'
import { AllIconNames, mapIcon } from '@oleksii-lavka/grocee-icons'
import Link from 'next/link'
import { FocusRing } from 'react-aria'
import { ContactForm } from './contact-form'
import { Breadcrumb, Breadcrumbs } from 'ui'
import Loading from './loading'
import { useSSR } from '@/hooks'

type Props = {
  pageTitle?: string
  pageSubtitle?: string
  breadcrumbs: Breadcrumb[]
}

export const ContactsPage: FC<Props> = ({ breadcrumbs, pageTitle, pageSubtitle }) => {
  const { support, contactPage } = useGlobalTypography()
  const { isServer } = useSSR()

  const mappedSupport = useMemo(() => {
    if (!support) {
      return null
    }

    const links = (support?.links ?? []).map(
      ({ type, caption, info, googleMapsLocation, id, icon }) => {
        const href =
          type === 'email'
            ? `mailto:${info}`
            : type === 'phone'
              ? `tel:${info}`
              : googleMapsLocation

        return {
          id: id!,
          caption: caption!,
          href: href ?? '',
          info: info ?? '',
          icon: {
            icon: icon.icon as AllIconNames,
            size: icon.size,
          },
        }
      },
    )

    return {
      links,
    }
  }, [support])

  if (isServer) {
    return <Loading isClient />
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className='grid-layout !gap-8'>
        <div className='col-span-full flex flex-col gap-8 laptop:col-span-4'>
          {(pageTitle || pageSubtitle) && (
            <div className='flex flex-col gap-2'>
              {pageTitle && (
                <h1 className='helvetica-xs font-light leading-[122%] text-gray-900 tablet:text-[36px] tablet:tracking-tightest'>
                  {pageTitle}
                </h1>
              )}

              {pageSubtitle && (
                <span className='gilroy-sm font-light text-gray-600'>{pageSubtitle}</span>
              )}
            </div>
          )}
          <ul className='flex flex-col gap-6'>
            {mappedSupport?.links.map(({ info, caption, href, id, icon }) => {
              const Icon = mapIcon(icon?.icon as AllIconNames)

              return (
                <li key={id}>
                  <FocusRing focusRingClass='ring ring-offset-2'>
                    <Link href={href} className='no-underline' target='_blank'>
                      <div className='flex items-center gap-4'>
                        {Icon && (
                          <div className='rounded-[50%] bg-gray-25 p-3'>
                            <Icon
                              width={icon?.size?.width}
                              height={icon?.size?.height}
                              className='text-success-500'
                            />
                          </div>
                        )}

                        <div className='flex flex-col gap-1'>
                          <span className='gilroy-sm text-gray-900'>{info}</span>
                          <span className='gilroy-xs font-light text-gray-600'>{caption}</span>
                        </div>
                      </div>
                    </Link>
                  </FocusRing>
                </li>
              )
            })}
          </ul>
        </div>
        <div className='col-span-full laptop:col-start-5 laptop:col-end-13'>
          {contactPage.subtitle && (
            <h2 className='gilroy-lg font-light leading-[133%] text-gray-900 laptop:text-[24px]'>
              {contactPage.subtitle}
            </h2>
          )}

          <ContactForm />
        </div>
      </div>
    </>
  )
}
