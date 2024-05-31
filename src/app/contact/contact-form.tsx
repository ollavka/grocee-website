'use client'

import { sendHelpMail } from '@/actions'
import { useGlobalTypography } from '@/store'
import { useFormState, useFormStatus } from 'react-dom'
import { Button, Input } from 'ui'
import { ChangeEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      variant='primary'
      type='submit'
      standartButton
      className='laptop:min-w-[187px] laptop:self-end'
      isLoading={pending}
    >
      {children}
    </Button>
  )
}

const initialFieldsValue = {
  fullName: '',
  email: '',
  subject: '',
  comment: '',
}

export const ContactForm = () => {
  const { contactPage, sendMailLabels } = useGlobalTypography()
  const [sendHelpMailState, sendHelpMailAction] = useFormState(sendHelpMail, null)

  const [fields, setFields] = useState(initialFieldsValue)

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }, [])

  useEffect(() => {
    if (!sendHelpMailState) {
      return
    }

    if (!sendHelpMailState?.success) {
      toast.error(sendMailLabels.error)

      return
    }

    toast.success(sendMailLabels.success)
    setFields(initialFieldsValue)
  }, [sendHelpMailState, sendMailLabels])

  return (
    <form
      action={sendHelpMailAction}
      className='mt-6 flex flex-col gap-6 border-t-[1px] border-gray-100 pt-6 laptop:mt-10 laptop:gap-10 laptop:pt-10'
    >
      <div className='flex flex-col gap-4 laptop:flex-row'>
        <Input
          name='fullName'
          type='text'
          value={fields.fullName}
          onChange={onChange}
          leadingComplex={{ start: { icon: 'Person', size: { width: 14, height: 13 } } }}
          placeholder={contactPage.fullName.placeholder}
          label={contactPage.fullName.label}
          aria-label='fullName'
          className='grow'
          errorMessage={sendHelpMailState?.errors?.fullName}
        />

        <Input
          name='email'
          type='email'
          value={fields.email}
          onChange={onChange}
          leadingComplex={{ start: { icon: 'Mail', size: { width: 18, height: 14 } } }}
          placeholder={contactPage.email.placeholder}
          label={contactPage.email.label}
          aria-label='email'
          className='grow'
          errorMessage={sendHelpMailState?.errors?.email}
        />
      </div>

      <Input
        name='subject'
        type='text'
        value={fields.subject}
        onChange={onChange}
        placeholder={contactPage.subject.placeholder}
        label={contactPage.subject.label}
        aria-label='subject of appeal'
        className='grow'
        maxLength={80}
        showLength
        errorMessage={sendHelpMailState?.errors?.subject}
      />

      <Input
        name='comment'
        type='textarea'
        value={fields.comment}
        onChange={onChange}
        placeholder={contactPage.comment.placeholder}
        label={contactPage.comment.label}
        aria-label='comment'
        className='grow'
        maxLength={500}
        showLength
        rows={7}
        errorMessage={sendHelpMailState?.errors?.comment}
      />

      <SubmitButton>{contactPage.sendButtonLabel}</SubmitButton>
    </form>
  )
}
