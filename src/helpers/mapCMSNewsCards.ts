import { getCollectionItem } from '@/cms'
import { pageToUrl, resolveRelation } from '@/cms/helpers'
import { News, NewsCardBlock } from 'cms-types'
import { parsePayloadLink } from './parsePayloadLink'

export const mapCMSNewsCards = async (newsCards: NewsCardBlock[] | News[], locale: string) => {
  const mappedNewsCards = await Promise.all(
    (newsCards ?? []).map(async newsCard => {
      let newsArticle: News

      if ('blockType' in newsCard && newsCard.blockType === 'NewsCard') {
        newsArticle = resolveRelation(newsCard.newsArticle) as News
      } else {
        newsArticle = newsCard as News
      }

      let previewImage = newsArticle.previewImage

      if (typeof previewImage === 'string') {
        previewImage = await getCollectionItem(previewImage, 'images', { searchParams: { locale } })
      }

      const { id, title, titleColor, link, tag } = newsArticle

      const parsedLink = parsePayloadLink(link)

      const resolvedTag =
        typeof tag === 'string'
          ? await getCollectionItem(tag, 'tags', { searchParams: { locale } })
          : tag

      return {
        id: id as string,
        title,
        previewImage,
        titleColor,
        link: {
          url: parsedLink,
          label: link.label,
        },
        tag: resolvedTag?.label ?? null,
      }
    }),
  )

  return mappedNewsCards
}
