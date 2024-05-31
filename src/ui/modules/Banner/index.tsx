'use client'

import { BannerBlock, GlobalTypography, Image as PayloadImageType } from 'cms-types'
import { FC } from 'react'
import { MappedLink } from '../../types'
import clsx from 'clsx'
import { FocusRing } from 'react-aria'
import Link from 'next/link'
import { AllIconNames, mapIcon } from '@oleksii-lavka/grocee-icons'
import { PayloadImage, Select, Input, Button } from 'ui'

type CommonHeading = {
  links: MappedLink[]
  logo: {
    image: PayloadImageType
    page: string
  }
  title: string
}

type InfoHeadingProps = {
  type: 'info'
} & Omit<NonNullable<BannerBlock['heading']['info']>, 'links' | 'logo'> &
  CommonHeading

type OrderDeliveryHeadingProps = {
  type: 'orderDelivery'
  orderDeliveryFormTypography: GlobalTypography['orderDeliveryForm']
} & Omit<NonNullable<BannerBlock['heading']['orderDelivery']>, 'links' | 'logo'> &
  CommonHeading

export type BannerProps = {
  className?: string
  previewImage: PayloadImageType
} & (
  | {
      type: 'info'
      heading: InfoHeadingProps
    }
  | {
      type: 'orderDelivery'
      heading: OrderDeliveryHeadingProps
    }
)

export const Banner: FC<BannerProps> = ({ heading, previewImage, type, className }) => {
  return (
    <section
      role='banner'
      className={clsx('relative overflow-hidden px-4 py-8 tablet:px-8 laptop:px-[68px]', className)}
    >
      <PayloadImage
        src={previewImage}
        className='absolute left-0 right-0 top-0 h-full w-full'
        skipBlur
        objectFit='cover'
        style={{ zIndex: 2 }}
      />

      {type === 'info' ? <InfoHeading {...heading} /> : <OrderDeliveryHeading {...heading} />}
    </section>
  )
}

function InfoHeading({ links, list, listMarker, logo, title }: InfoHeadingProps) {
  const ListMarker = mapIcon(listMarker?.icon || null)

  return (
    <div
      style={{ zIndex: 3 }}
      className='relative my-8 flex max-w-[496px] flex-col gap-8 rounded-[32px] bg-white p-8 tablet:float-right laptop:my-[56px]'
    >
      <FocusRing focusRingClass='ring ring-offset-2'>
        <Link className='h-[30px] w-[86px]' href={logo.page}>
          <PayloadImage className='h-full w-full' src={logo.image} />
        </Link>
      </FocusRing>

      <div className='flex flex-col gap-4'>
        <h3 className='helvetica-sm font-light text-gray-900'>{title}</h3>

        <ul className='flex flex-col gap-2'>
          {list.map(({ listItem, id }) => (
            <li
              key={id}
              className={clsx('text-gray-700', {
                'flex items-center gap-1': !!ListMarker,
              })}
            >
              {ListMarker && (
                <ListMarker width={listMarker.size.width} height={listMarker.size.height} />
              )}
              <span className='gilroy-sm'>{listItem}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col justify-between gap-2 min-[496px]:flex-row'>
        {links.map(({ id, label, linkHref, appearance, icons, isStandartButton, newTab }) => (
          <Button
            key={id}
            href={linkHref}
            variant={appearance || 'primary'}
            leftIcon={{
              icon: icons?.leftIcon.icon as AllIconNames,
              size: {
                width: icons?.leftIcon.size?.width!,
                height: icons?.leftIcon.size?.height!,
              },
            }}
            rightIcon={{
              icon: icons?.rightIcon.icon as AllIconNames,
              size: {
                width: icons?.rightIcon.size?.width!,
                height: icons?.rightIcon.size?.height!,
              },
            }}
            target={newTab ? '_blank' : '_self'}
            standartButton={isStandartButton || false}
            linkClassName='grow'
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function OrderDeliveryHeading({
  links,
  subtitle,
  orderDeliveryFormTypography,
  logo,
  title,
}: OrderDeliveryHeadingProps) {
  const { firstName, lastName, phoneNumber, shippingAddress, date, time } =
    orderDeliveryFormTypography

  return (
    <div
      style={{ zIndex: 3 }}
      className='relative flex max-w-[496px] flex-col gap-8 rounded-[32px] bg-white p-8 tablet:float-right tablet:max-w-min'
    >
      <FocusRing focusRingClass='ring ring-offset-2'>
        <Link className='h-[30px] w-[86px]' href={logo.page}>
          <PayloadImage className='h-full w-full' src={logo.image} />
        </Link>
      </FocusRing>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <h3 className='helvetica-xs font-light text-gray-900 tablet:text-[32px] tablet:leading-[125%]'>
            {title}
          </h3>

          <p className='gilroy-sm text-gray-700'>{subtitle}</p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 tablet:flex-row'>
          <Input
            name='firstName'
            type='text'
            label={firstName.label}
            placeholder={firstName.placeholder}
            aria-label='firstName'
            className='grow'
          />
          <Input
            name='lastName'
            type='text'
            label={lastName.label}
            placeholder={lastName.placeholder}
            aria-label='lastName'
            className='grow'
          />
        </div>
        <Input
          name='phoneNumber'
          type='tel'
          label={phoneNumber.label}
          placeholder={phoneNumber.placeholder}
          aria-label='phoneNumber'
          leadingComplex={{
            end: (
              <Select
                listWidth={200}
                label={{
                  select: 'phone-code-select',
                  listOptions: 'phone-code-select-items',
                  option: 'phone-code',
                }}
                options={[
                  {
                    label: '+111',
                    value: '+111',
                  },
                  {
                    label: '+222',
                    value: '+222',
                  },
                  {
                    label: '+333',
                    value: '+333',
                  },
                ]}
                selectedValue='+111'
                useAsTriggerLabel='label'
                animationOrigin='top left'
                listPosition={{
                  horizontal: 'left',
                  vertical: 'bottom',
                }}
                triggerProps={{
                  variant: 'secondary',
                  disableBorder: true,
                  rightIcon: {
                    icon: 'ChevronDown',
                    size: 12,
                    animateWhen: selectState => !!selectState?.isOpen,
                    animationProps: {
                      initial: {
                        rotate: '180deg',
                      },
                      exit: {
                        rotate: '0deg',
                      },
                    },
                  },
                }}
              />
            ),
          }}
        />
        <Input
          name='shippingAddress'
          type='text'
          label={shippingAddress.label}
          placeholder={shippingAddress.placeholder}
          aria-label='shippingAddress'
          trailingComplex={{
            start: {
              icon: 'Location',
            },
          }}
        />
        <div className='flex flex-col gap-4 tablet:flex-row'>
          <Input
            name='dateOfShipping'
            type='date'
            label={date.label}
            placeholder={date.placeholder}
            aria-label='dateOfShipping'
            className='w-full grow'
            trailingComplex={{
              start: {
                icon: 'Calendar',
              },
            }}
          />
          <Input
            name='timeOfShipping'
            type='time'
            label={time.label}
            placeholder={time.placeholder}
            aria-label='timeOfShipping'
            className='w-full grow'
            trailingComplex={{
              start: {
                icon: 'Alarm',
                size: {
                  width: 20,
                },
              },
            }}
          />
        </div>
      </div>

      <div className='flex flex-col justify-between gap-2 min-[496px]:flex-row'>
        {links.map(({ id, label, linkHref, appearance, icons, isStandartButton, newTab }) => (
          <Button
            key={id}
            href={linkHref}
            variant={appearance || 'primary'}
            leftIcon={{
              icon: icons?.leftIcon.icon as AllIconNames,
              size: {
                width: icons?.leftIcon.size?.width!,
                height: icons?.leftIcon.size?.height!,
              },
            }}
            rightIcon={{
              icon: icons?.rightIcon.icon as AllIconNames,
              size: {
                width: icons?.rightIcon.size?.width!,
                height: icons?.rightIcon.size?.height!,
              },
            }}
            target={newTab ? '_blank' : '_self'}
            standartButton={isStandartButton || false}
            linkClassName='grow'
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
