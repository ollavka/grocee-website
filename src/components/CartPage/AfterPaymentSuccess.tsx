'use client'

import { useGlobalTypography, useShoppingBasket } from '@/store'
import { CheckCirle } from '@oleksii-lavka/grocee-icons/icons'
import { FC, useMemo, useCallback, useState, useEffect } from 'react'
import { Button, Loader } from 'ui'
import { Checkout } from 'ui/types'
import { motion } from 'framer-motion'
import { AfterPaymentCancel } from './AfterPaymentCancel'
import { useSSR } from '@/hooks'

export const AfterPaymentSuccess: FC = () => {
  const { afterPayment } = useGlobalTypography(state => state.cart)
  const { checkoutId, clearLineItems } = useShoppingBasket()
  const { isServer } = useSSR()
  const [downloading, setDownloading] = useState(false)
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)

  const onDownloadInvoice = useCallback(() => {
    setDownloading(true)

    setTimeout(() => {
      setDownloading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (!checkoutId) {
      return
    }

    const getCheckout = async () => {
      const checkout = (await (
        await fetch(`/api/checkout?id=${checkoutId}`, {
          cache: 'no-store',
          next: {
            revalidate: 0,
          },
        })
      ).json()) as Checkout

      if (!checkout?.invoice?.pdfUrl) {
        getCheckout()
      }

      setCheckout(checkout)
    }

    try {
      setIsError(false)
      setIsPending(true)
      getCheckout()
    } catch (err) {
      console.log(err)
      setIsError(true)
    } finally {
      setIsPending(false)
      clearLineItems()
    }
  }, [checkoutId])

  const shippingAddress = useMemo(() => {
    const { city = '', line1 } = checkout?.shipping_details?.address || {}

    return `${city}, ${line1}`
  }, [checkout, isServer, checkoutId])

  const shippingDate = useMemo(() => {
    const date = (checkout?.custom_fields ?? []).find(({ key }) => key === 'date')

    if (!date) {
      return '-'
    }

    return date.text?.value ?? '-'
  }, [checkout, isServer, checkoutId])

  if (isError || (!isError && !isPending && !checkoutId)) {
    return <AfterPaymentCancel toastMessage={afterPayment.success.checkoutLoadedError} />
  }

  if (isServer || isPending || !checkout?.id) {
    return (
      <div className='mx-auto mt-[120px] flex min-h-[470px] max-w-[510px] items-center justify-center px-4 tablet:mt-[150px]'>
        <Loader size={64} className='text-success-600' />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: '0.4',
      }}
      className='mx-auto mt-[120px] flex max-w-[510px] flex-col gap-6 px-4 tablet:mt-[150px] tablet:gap-8 laptop:gap-10'
    >
      <CheckCirle className='self-center text-success-600' size={48} />

      <div className='flex flex-col items-center gap-4'>
        <h1 className='helvetica-xs text-center font-light text-gray-900'>
          {afterPayment.success.title}
        </h1>
        <p className='giloy-sm text-center font-light text-gray-700 tablet:text-[16px] tablet:font-normal tablet:leading-[150%]'>
          {afterPayment.success.description}
        </p>
      </div>

      <ul className='flex flex-col gap-2 border-b-[1px] border-gray-100 pb-6 tablet:pb-8 laptop:pb-10'>
        <li className='flex items-center'>
          <span className='gilroy-md block grow text-gray-700'>
            {afterPayment.success.deliveryTime}
          </span>
          <span className='gilroy-md block text-gray-900'>{shippingDate}</span>
        </li>
        <li className='flex items-center justify-between'>
          <span className='gilroy-md block grow text-gray-700'>
            {afterPayment.success.deliveryAddress}
          </span>
          <span className='gilroy-md block text-gray-900'>{shippingAddress}</span>
        </li>
      </ul>

      <div className='flex items-center justify-between'>
        <span className='gilroy-xl block grow text-gray-700'>{afterPayment.success.totalSum}</span>
        <span className='gilroy-xl text-gray-900'>
          UAH {(checkout?.amount_total! / 100).toFixed(2)}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant='primary'
          href={checkout?.invoice?.pdfUrl ?? ''}
          standartButton
          linkClassName='col-span-full tablet:col-span-1'
          className='col-span-full tablet:col-span-1'
          isLoading={downloading}
          onClick={onDownloadInvoice}
        >
          {afterPayment.buttons.downloadInvoiceButton}
        </Button>
        <Button
          variant='secondary'
          href='/'
          standartButton
          linkClassName='col-span-full tablet:col-span-1'
        >
          {afterPayment.buttons.backToHomeLink}
        </Button>
      </div>
    </motion.div>
  )
}
