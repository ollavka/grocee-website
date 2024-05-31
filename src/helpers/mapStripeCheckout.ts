import stripe, { CheckoutSession } from '@/stripe'
import Stripe from 'stripe'

export const mapStripeCheckout = async (session: CheckoutSession) => {
  if (!session) {
    return null
  }

  const {
    id,
    amount_total,
    cancel_url,
    success_url,
    payment_status,
    url,
    invoice,
    customer,
    customer_details,
    shipping_cost,
    shipping_details,
    custom_fields,
    payment_method_collection,
    payment_method_options,
    payment_intent,
  } = session

  const invoiceData = await generateInvoice(invoice, payment_intent)

  return {
    id,
    customer,
    amount_total,
    cancel_url,
    success_url,
    payment_status,
    url,
    customer_details,
    shipping_cost,
    shipping_details,
    custom_fields,
    payment_method_collection,
    payment_method_options,
    invoice: {
      id: invoiceData?.id ?? null,
      pdfUrl: invoiceData?.invoice_pdf ?? null,
    },
  }
}

async function generateInvoice(
  invoice: Stripe.Invoice | string | null,
  paymentIntent: Stripe.PaymentIntent | string | null,
) {
  if (typeof invoice !== 'string' && invoice) {
    return invoice
  }

  if (typeof invoice === 'string') {
    const invoiceData = await stripe.invoices.retrieve(invoice as string)

    return invoiceData
  }

  if (typeof paymentIntent === 'string') {
    const payment = await stripe.paymentIntents.retrieve(paymentIntent)

    // @ts-ignore
    const invoiceData = await stripe.invoices.retrieve(payment?.invoice)

    return invoiceData
  }

  // @ts-ignore
  const invoiceData = await stripe.invoices.retrieve(paymentIntent?.invoice)

  return invoiceData
}
