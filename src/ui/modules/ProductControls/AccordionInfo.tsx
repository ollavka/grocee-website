'use client'

import { FC, useState } from 'react'
import { Button } from '../..'

type Props = {
  title: string
  options: {
    label: string
    value?: string | number | null
  }[]
}

export const AccordionInfo: FC<Props> = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='flex flex-col gap-4 rounded-lg bg-gray-25 p-4'>
      <Button
        variant='secondary'
        disableBorder
        className='gilroy-xl w-full py-2 !font-normal text-gray-900'
        contentClassName='!justify-between'
        onClick={() => setIsOpen(prev => !prev)}
        rightIcon={{
          icon: 'ChevronDown',
          animateWhen: value => !!value,
          value: isOpen,
          animationProps: {
            initial: { rotate: '0deg' },
            exit: { rotate: '180deg' },
          },
        }}
      >
        {title}
      </Button>

      <div className='h-[1px] w-full bg-gray-100' />

      <div
        aria-hidden={!isOpen}
        className='gilroy-md text-gray-700'
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms',
        }}
      >
        <div className='overflow-hidden'>
          <ul className='flex flex-col gap-2'>
            {options.map(({ label, value }, idx) => (
              <li key={`${label}-${idx}`} className='flex justify-between gap-2'>
                <span className='gilroy-md block grow'>{label}</span>
                <span className='gilroy-md block'>{value ?? '-'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
