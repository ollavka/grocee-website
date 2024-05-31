import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/stripe'
import { mapStripeCheckout } from '@/helpers/mapStripeCheckout'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const id = searchParams.get('id') ?? ''

    const session = await stripe.checkout.sessions.retrieve(id)

    const mappedCheckout = await mapStripeCheckout(session)

    return NextResponse.json(mappedCheckout)
  } catch (err: unknown) {
    console.log({ message: (err as Error).message })
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
