import clsx from 'clsx'
import { Image, ImageWithTextBlock } from 'cms-types'
import { PayloadImage } from 'ui'

export function ImageWithText({ image, content, imagePosition }: ImageWithTextBlock) {
  return (
    <div
      className={clsx('flex flex-col gap-4 laptop:flex-row laptop:gap-14', {
        'flex-col laptop:flex-row': imagePosition === 'left',
        'flex-col-reverse laptop:flex-row-reverse': imagePosition === 'right',
      })}
    >
      <div className='relative max-h-[310px] min-h-[310px] w-full basis-[50%] overflow-hidden rounded-2xl'>
        <PayloadImage
          src={image as Image}
          skipBlur
          imgProps={{
            className: 'absolute left-0 top-0 h-full w-full object-cover',
          }}
        />
      </div>
      <ul className='flex basis-[50%] flex-col gap-2'>
        {content.map(({ id, text }) => (
          <li className='gilroy-lg font-light' key={id}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
