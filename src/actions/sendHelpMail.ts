'use server'

import { getGlobal } from '@/cms'
import { z, ZodError } from 'zod'
import nodemailer from 'nodemailer'

export const sendHelpMail = async (prevState: any, formData: FormData) => {
  const { formErrorLabels, support } = await getGlobal('globalTypography')

  const { textField: textFieldErrorLabels } = formErrorLabels

  const emailAddress =
    support.links?.find(({ type }) => type === 'email')?.info || process.env.EMAIL

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
      user: emailAddress,
      pass: process.env.EMAIL_PASS,
    },
  })

  const schema = z.object({
    fullName: z.string().min(1, textFieldErrorLabels?.nonEmptyString ?? ''),
    email: z.string().email(textFieldErrorLabels?.invalidEmail ?? ''),
    subject: z.string().min(1, textFieldErrorLabels?.nonEmptyString ?? ''),
    comment: z.string().min(1, textFieldErrorLabels?.nonEmptyString ?? ''),
  })

  const fullName = formData.get('fullName')
  const email = formData.get('email')
  const subject = formData.get('subject')
  const comment = formData.get('comment')

  try {
    schema.parse({
      fullName,
      email,
      subject,
      comment,
    })

    await transporter.sendMail({
      replyTo: email as string,
      to: process.env.EMAIL,
      subject: subject as string,
      text: comment as string,
      html: `
        <div style={styles.container}>
          <div style={styles.userInfo}>
            <strong>Sender:</strong>
            <span>${fullName}, ${email}</span>
          </div>
          <br />
          <div>${comment}</div>
        </div>
      `,
    })

    return {
      success: true,
      errors: undefined,
    }
  } catch (err) {
    const zodError = err as ZodError

    const errorMap = zodError?.flatten?.()?.fieldErrors ?? {}

    return {
      success: false,
      errors: {
        fullName: errorMap['fullName']?.[0] ?? '',
        email: errorMap['email']?.[0] ?? '',
        subject: errorMap['subject']?.[0] ?? '',
        comment: errorMap['comment']?.[0] ?? '',
      },
    }
  }
}
