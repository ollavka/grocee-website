/* eslint-disable no-unused-vars */
import { AllIconNames, IconType } from '@oleksii-lavka/grocee-icons'
import { parseIcon } from '../../helpers/parseIcon'
import { clsx } from 'clsx'
import { ReactNode, isValidElement } from 'react'

type Icon = {
  icon: AllIconNames | IconType
  size?: {
    width?: number
    height?: number
  }
}

type EndPartObject = {
  icon: Icon
  text: string
}

export type ComplexProps = {
  type: 'left' | 'right'
  start?: Icon
  end?: EndPartObject | ReactNode
  disableDivider?: boolean
  className?: string
}

export function Complex({ type, start, end, disableDivider, className = '' }: ComplexProps) {
  const { icon: StartIcon } = parseIcon({ icon: start?.icon })

  const endPartIsObject = !!(
    end &&
    typeof end === 'object' &&
    'icon' in end &&
    !isValidElement(end)
  )

  const { icon: EndIcon } = endPartIsObject ? parseIcon({ icon: end.icon.icon }) : { icon: null }

  return (
    <div
      className={clsx(
        'flex gap-2 text-gray-800',
        {
          'pr-2': type === 'left' && (start || end),
          'pl-2': type === 'right' && (start || end),
          'mr-2 border-r-[1px] border-r-gray-100': type === 'left' && end && !disableDivider,
          'ml-2 border-l-[1px] border-l-gray-100': type === 'right' && end && !disableDivider,
        },
        className,
      )}
    >
      {StartIcon && (
        <StartIcon
          width={start?.size?.width ?? 16}
          height={start?.size?.height ?? 24}
          className={clsx({
            'text-gray-800': end,
            'text-gray-400': !end && type === 'left',
            'text-gray-200': !end && type === 'right',
          })}
        />
      )}

      {endPartIsObject && EndIcon && (
        <div className='flex items-center gap-2'>
          <span className='select-none text-sm'>{end.text}</span>
          <EndIcon width={start?.size?.width ?? 16} height={start?.size?.height ?? 24} />
        </div>
      )}

      {!endPartIsObject && end}
    </div>
  )
}
