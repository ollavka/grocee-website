import { CarouselBlock } from 'cms-types'
import { CarouselClient } from './CarouselClient'
import { mapCMSProducts } from '@/helpers/mapCMSProducts'
import { mapCMSNewsCards } from '@/helpers/mapCMSNewsCards'
import { mapCMSCards } from '@/helpers/mapCMSCards'
import { MappedCard, MappedNewsArticleCard, MappedProduct } from 'ui/types'
import { getCookies } from 'next-client-cookies/server'

export async function Carousel({ settings, cards, products, title, newsCards }: CarouselBlock) {
  const { type } = settings
  const cookies = getCookies()

  const locale = cookies.get('locale') || 'en'

  let mappedSlides: MappedProduct[] | MappedNewsArticleCard[] | MappedCard[]

  switch (type) {
    case 'productCard':
      mappedSlides = await mapCMSProducts(products!, locale)
      break

    case 'newsCard':
      mappedSlides = await mapCMSNewsCards(newsCards!, locale)
      break

    case 'simpleCard':
      mappedSlides = await mapCMSCards(cards!, locale)
      break

    default:
      mappedSlides = []
  }

  //@ts-ignore
  return <CarouselClient settings={settings} title={title} slides={mappedSlides} type={type} />
}
