'use client'

import { FC, ReactNode } from 'react'
import { Button } from 'ui'
import { useFormStatus } from 'react-dom'

type Props = {
  isDisabled?: boolean
  children?: ReactNode
}

export const CheckoutButton: FC<Props> = ({ isDisabled, children }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      variant='primary'
      standartButton
      isDisabled={isDisabled}
      isLoading={pending}
      loaderWithoutChildren
      className='grow'
      type='form-button'
    >
      {children}
    </Button>
  )
}
