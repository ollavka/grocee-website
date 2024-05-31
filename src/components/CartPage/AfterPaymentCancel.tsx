'use client'

import { CloseCircle } from '@oleksii-lavka/grocee-icons/icons'
import { FC, useEffect } from 'react'
import { Button, Loader } from 'ui'
import { motion } from 'framer-motion'
import { useGlobalTypography } from '@/store'
import { useSSR } from '@/hooks'
import { toast } from 'react-hot-toast'

type Props = {
  toastMessage?: string
}

export const AfterPaymentCancel: FC<Props> = ({ toastMessage }) => {
  const { afterPayment } = useGlobalTypography(state => state.cart)

  const { isServer } = useSSR()

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    toast.error(toastMessage)
  }, [toastMessage])

  if (isServer) {
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
      <CloseCircle className='self-center text-error-600' size={48} />

      <div className='flex flex-col items-center gap-4'>
        <h1 className='helvetica-xs text-center font-light text-gray-900'>
          {afterPayment.canceled.title}
        </h1>
        <p className='giloy-sm text-center font-light text-gray-700 tablet:text-[16px] tablet:font-normal tablet:leading-[150%]'>
          {afterPayment.canceled.description}
        </p>
      </div>

      <div className='flex flex-col gap-2 tablet:flex-row'>
        <Button variant='primary' href='/cart' standartButton linkClassName='grow !block w-full'>
          {afterPayment.buttons.backToCartLink}
        </Button>
        <Button variant='secondary' href='/' standartButton linkClassName='grow !block w-full'>
          {afterPayment.buttons.backToHomeLink}
        </Button>
      </div>
    </motion.div>
  )
}
