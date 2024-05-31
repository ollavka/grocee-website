'use server'

import { MappedProduct } from 'ui/types'
import stripe from '@/stripe'
import { redirect } from 'next/navigation'

export const createCheckout = async (
  lineItems: (MappedProduct & { quantity?: number })[],
  shippingRateId?: string,
) => {
  const { id, url } = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_WEBSITE_PUBLIC_URL}/cart?paymentStatus=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_PUBLIC_URL}/cart?paymentStatus=canceled`,
    mode: 'payment',
    currency: 'uah',
    payment_method_types: ['card'],
    line_items: lineItems.map(({ price, quantity }) => ({
      quantity,
      price: price.id,
    })),
    shipping_options: [{ shipping_rate: shippingRateId }],
    shipping_address_collection: { allowed_countries: ['UA'] },
    phone_number_collection: { enabled: true },
    invoice_creation: { enabled: true },
    custom_fields: [
      {
        type: 'text',
        key: 'date',
        label: {
          type: 'custom',
          custom: 'Date of shipping. For example: "24/08/2024 18-00"',
        },
      },
    ],
  })

  return {
    redirectToCheckout: async (url: string) => {
      'use server'

      redirect(url)
    },
    checkout: {
      id,
      url,
    },
  }
}
