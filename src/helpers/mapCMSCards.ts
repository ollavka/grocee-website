import { getCollectionItem } from '@/cms'
import { CardBlock, Image } from 'cms-types'
import { parsePayloadLink } from './parsePayloadLink'

export const mapCMSCards = async (cards: CardBlock[], locale: string) => {
  const mappedCards = await Promise.all(
    (cards ?? []).map(async card => {
      const { image, link, id, text, gap } = card

      let previewImage = image

      if (typeof previewImage === 'string') {
        previewImage = (await getCollectionItem(previewImage, 'images', {
          searchParams: { locale },
        })) as Image
      }

      const parsedLink = parsePayloadLink(link)

      return {
        id: id as string,
        text,
        gap,
        link: parsedLink,
        image: previewImage,
      }
    }),
  )

  return mappedCards
}
