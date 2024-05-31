import { Stripe } from 'stripe'

const client = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
})

export type CreateCheckoutProps = Stripe.Checkout.SessionCreateParams
export type CheckoutSession = Stripe.Response<Stripe.Checkout.Session>

export default client
