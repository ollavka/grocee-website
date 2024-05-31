import { getCollectionItem } from '@/cms'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { BannerBlock } from 'cms-types'
import { BannerClient } from './BannerClient'

export async function Banner({ heading, previewImage }: BannerBlock) {
  const mappedHeading = await mapBannerHeading(heading)
  const parsedPreviewImage =
    typeof previewImage === 'string'
      ? await getCollectionItem(previewImage, 'images')
      : previewImage

  return (
    //@ts-ignore
    <BannerClient
      previewImage={parsedPreviewImage}
      //@ts-ignore
      heading={{ ...mappedHeading, orderDeliveryFormTypography: {} }}
      type={mappedHeading.type}
    />
  )
}

async function mapBannerHeading(heading: BannerBlock['heading']) {
  const { type, info, orderDelivery, logo, title, links } = heading

  const mappedLinks = await Promise.all(
    (links ?? []).map(({ linkOrButton, id }) => {
      const { reference, url, linkType, ...restLink } = linkOrButton
      const parsedLinkUrl = parsePayloadLink({ reference, type: linkType, url })

      return {
        ...restLink,
        id: id!,
        linkHref: parsedLinkUrl,
      }
    }),
  )

  const parsedLogo = {
    image:
      typeof logo?.image === 'string' ? await getCollectionItem(logo.image, 'images') : logo?.image,
    page: parsePayloadLink(logo?.page),
  }

  if (type === 'info') {
    const { list, listMarker } = info!

    return {
      ...info,
      list: list!,
      listMarker: listMarker!,
      logo: parsedLogo,
      links: mappedLinks,
      title: title!,
      type: 'info' as const,
    }
  }

  const { subtitle } = orderDelivery!

  return {
    ...orderDelivery,
    links: mappedLinks,
    logo: parsedLogo,
    title: title!,
    subtitle: subtitle!,
    type: 'orderDelivery' as const,
  }
}
