'use client'

import clsx from 'clsx'
import { FC, useId, useState } from 'react'
import { Button } from 'ui'
import { AllIconNames, IconType } from '@oleksii-lavka/grocee-icons'
import { useCanHover } from '../../hooks'

type Panel = {
  id: string
  title: string
  content: string
}

type AccordionProps = {
  panels: Panel[]
  link?: {
    label: string
    href: string
    icon?: {
      icon?: AllIconNames | IconType | null
      size?: {
        width?: number
        height?: number
      }
    }
  }
  withoutLink: boolean
  className?: string
}

export const AccordionList: FC<AccordionProps> = ({
  panels,
  link,
  withoutLink,
  className = '',
}) => {
  const accodriodnId = useId()
  const [openedPanel, setOpenedPanel] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const canHover = useCanHover()

  return (
    <div className='flex flex-col gap-8'>
      <ul className={clsx('list-none', className)}>
        {panels.map(({ title, content }, idx) => {
          const headingId = `${accodriodnId}-heading-${idx}`
          const contentId = `${accodriodnId}-content-${idx}`
          const isSelected = idx === openedPanel

          const isLast = idx === panels.length - 1

          const icon: AllIconNames = isSelected ? 'MinusCircle' : 'PlusCircle'

          return (
            <li
              key={headingId}
              className={clsx('flex flex-col overflow-hidden border-t-[1px] border-gray-100 py-8', {
                'border-b-[1px]': isLast,
              })}
            >
              <div className='flex items-center justify-between gap-2'>
                <h3 className='helvetica-xs grow font-light text-gray-900'>{title}</h3>

                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  aria-expanded={isSelected}
                  aria-controls={contentId}
                  className='rounded-[1000px] p-[15px]'
                  leftIcon={{ icon, size: 18 }}
                  onClick={() => {
                    setOpenedPanel(isSelected ? null : idx)
                  }}
                />
              </div>

              <div
                id={contentId}
                aria-labelledby={headingId}
                aria-hidden={!isSelected}
                className='gilroy-md text-gray-700'
                style={{
                  display: 'grid',
                  gridTemplateRows: isSelected ? '1fr' : '0fr',
                  transition: 'grid-template-rows 300ms',
                }}
              >
                <div className='overflow-hidden'>
                  <div className='mt-4'>{content}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {link && !withoutLink && (
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
  )
}
