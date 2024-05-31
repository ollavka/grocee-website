import { BannerBlock } from 'cms-types';
import { mapCMSCards } from '@/helpers/mapCMSCards';
import { mapCMSNewsCards } from '@/helpers/mapCMSNewsCards';
import { mapCMSProducts } from '@/helpers/mapCMSProducts';
import { Stripe } from 'stripe';
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type MappedProduct = Awaited<ReturnType<typeof mapCMSProducts>>[number];

export type MappedNewsArticleCard = Awaited<
  ReturnType<typeof mapCMSNewsCards>
>[number];

export type MappedCard = Awaited<ReturnType<typeof mapCMSCards>>[number];

export type MappedLink = Omit<
  NonNullable<
    NonNullable<BannerBlock['heading']['links'][number]>['linkOrButton']
  >,
  'reference' | 'url' | 'linkType'
> & {
  id: string;
  linkHref: string;
};

export type CommonLink = {
  id: string;
  label: string;
  link: string;
};

export type StripePiceJSON = Stripe.Response<Stripe.ApiList<Stripe.Price>>;

export type Checkout = Pick<
  Stripe.Checkout.Session,
  | 'id'
  | 'customer'
  | 'amount_total'
  | 'cancel_url'
  | 'success_url'
  | 'payment_status'
  | 'url'
  | 'customer_details'
  | 'shipping_cost'
  | 'shipping_details'
  | 'custom_fields'
> & {
  invoice: {
    id: string;
    pdfUrl: string;
  };
};
