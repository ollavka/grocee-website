import { Image, MainSliderBlock } from 'cms-types'
import { SlideProps as MainSlide, ButtonProps } from 'ui'
import { AllIconNames } from '@oleksii-lavka/grocee-icons'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { getCollectionItem } from '@/cms'
import { MainSliderClient } from './MainSliderClient'

export async function MainSlider({ slides, settings }: MainSliderBlock) {
  const mappedSlides: MainSlide[] = await Promise.all(
    (slides ?? []).map(async ({ id, heading, image }) => {
      let headingData: MainSlide['heading']

      if (heading?.showHeading) {
        const { title, link, description } = heading
        const { linkType, url, reference, icons } = link!

        headingData = {
          title,
          description,
          link: {
            text: link!.label,
            props: {
              href: parsePayloadLink({ url, reference, type: linkType }),
              leftIcon: {
                icon: (icons?.leftIcon.icon as AllIconNames) || undefined,
                size: {
                  width: icons?.leftIcon?.size?.width ?? undefined,
                  height: icons?.leftIcon?.size?.height ?? undefined,
                },
              },
              rightIcon: {
                icon: (icons?.rightIcon.icon as AllIconNames) || undefined,
                size: {
                  width: icons?.leftIcon?.size?.width ?? undefined,
                  height: icons?.leftIcon?.size?.height ?? undefined,
                },
              },
              target: link!.newTab ? '_blank' : '_self',
              standartButton: link!.isStandartButton ?? false,
              variant: link!.appearance as ButtonProps<string>['variant'],
            },
          },
        }
      }

      let previewImage = image

      if (typeof previewImage === 'string') {
        previewImage = (await getCollectionItem(previewImage, 'images')) as Image
      }

      return {
        id: id as string,
        image: previewImage as Image,
        heading: headingData,
      }
    }),
  )

  return (
    <MainSliderClient
      slides={mappedSlides}
      autoplay={settings?.autoplay ? { delay: 4000, pauseOnMouseEnter: true } : false}
      loop={settings?.loop || false}
      speed={settings?.speed || 500}
      effect={settings?.effect || 'slide'}
    />
  )
}
