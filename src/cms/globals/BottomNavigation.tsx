'use client'

import { type BottomNavigation as BottomNavigationType, type Image } from 'cms-types'
import { resolveRelation } from '../helpers'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { Footer } from 'ui'
import clsx from 'clsx'
import { useEdgeBlocksOnPage } from '@/store'

export default function BottomNavigation({
  logo,
  footerInfo,
  navGroups,
  subscribeSection,
}: BottomNavigationType) {
  const resolvedLogo = resolveRelation(logo.image)
  const logoUrl = parsePayloadLink(logo.page)
  const { lastBlockOnPage } = useEdgeBlocksOnPage()

  const mappedNavGroups = (navGroups ?? []).map(({ title, links }) => {
    const mappedLinks = (links ?? []).map(({ page, id }) => {
      const parsedLink = parsePayloadLink(page)

      return {
        id: id!,
        label: page.label!,
        page: parsedLink,
      }
    })

    return {
      title: title!,
      links: mappedLinks,
    }
  })

  return (
    <footer
      className={clsx(
        'mt-8 max-w-[1376px] bg-gray-900 px-4 py-8 tablet:mt-16 tablet:px-5 laptop:mt-20 laptop:px-12 laptop:py-16 desktop:mx-8 desktop:mb-10 desktop:rounded-2xl desktop:px-[68px] min-[1440px]:mx-auto',
        {
          'tablet:!mt-[-140px] tablet:!pt-[210px]': lastBlockOnPage === 'Banner',
        },
      )}
    >
      <Footer
        logo={{
          image: resolvedLogo as Image,
          url: logoUrl,
          caption: logo.caption,
        }}
        navGroups={mappedNavGroups}
        subscribeSection={subscribeSection}
        footerInfo={footerInfo}
      />
    </footer>
  )
}
