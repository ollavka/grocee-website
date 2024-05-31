'use client'

import { AllIconNames, mapIcon } from '@oleksii-lavka/grocee-icons'
import { Button } from 'ui'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useCanHover } from '../../hooks'
import { FocusRing } from 'react-aria'

type Props = {
  title?: string
  supportLinks: {
    id: string
    caption: string
    info: string
    href: string
    icon?: {
      icon?: AllIconNames
      size?: {
        width: number
        height: number
      }
    }
  }[]
  link?: {
    label: string
    href: string
    icon?: {
      icon?: AllIconNames
      size?: {
        width?: number
        height?: number
      }
    }
  }
  accordionBlock: JSX.Element
}

export const HelpBlock: FC<Props> = ({ title, accordionBlock, supportLinks, link }) => {
  const canHover = useCanHover()
  const [hovered, setHovered] = useState(false)

  return (
    <section className='width-limit flex grid-cols-12 flex-col gap-8 laptop:grid laptop:gap-x-8 laptop:gap-y-6'>
      <div className='flex grow flex-col gap-6 tablet:gap-8 laptop:col-span-6'>
        {title && <h3 className='helvetica font-light text-gray-900'>{title}</h3>}

        <ul className='flex flex-col gap-6'>
          {supportLinks.map(({ info, caption, href, id, icon }) => {
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

        {link && (
          <Button
            variant='tertiary'
            href={link.href}
            rightIcon={{
              icon: link.icon?.icon,
              size: link.icon?.size,
              value: hovered,
              animateWhen: value => !!value && canHover,
              animationProps: {
                initial: {
                  translateX: 3,
                },
                exit: {
                  translateX: 0,
                },
              },
            }}
            standartButton
            linkClassName='max-w-fit grow-0'
            onHoverStart={() => {
              setHovered(true)
            }}
            onHoverEnd={() => {
              setHovered(false)
            }}
          >
            {link.label}
          </Button>
        )}
      </div>

      <div className='laptop:col-span-6'>{accordionBlock}</div>
    </section>
  )
}
