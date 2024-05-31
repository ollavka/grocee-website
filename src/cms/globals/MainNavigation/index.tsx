import { type MainNavigation as MainNavigationType } from 'cms-types'
import { resolveRelation } from '../../helpers'
import { mapCMSCards } from '@/helpers/mapCMSCards'
import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { AllIconNames } from '@oleksii-lavka/grocee-icons'
import { MainNavigationClient } from './MainNavigationClient'
import { cookies } from 'next/headers'

export default async function MainNavigation({
  header,
  navigation,
  helpNavigation,
  defaultMenuHeader,
}: MainNavigationType) {
  const locale = cookies().get('locale')?.value || 'en'

  const { logo, navLinks, search } = header

  const resolvedLogo = resolveRelation(logo.image)
  const logoUrl = parsePayloadLink(logo.page)

  const { categories, integration, promotions } = navigation

  const mappedNavigation = {
    categories: {
      ...categories,
      icon: {
        ...categories.icon,
        icon: categories.icon.icon as AllIconNames,
      },
      cardLinks: await mapCMSCards(categories.cardLinks, locale),
      commonLinks: (categories.commonLinks ?? []).map(({ label, id, link }) => ({
        id: id!,
        label,
        link: parsePayloadLink(link),
      })),
    },
    promotions: {
      ...promotions,
      icon: {
        ...promotions.icon,
        icon: promotions.icon.icon as AllIconNames,
      },
      cardLinks: await mapCMSCards(promotions.cardLinks, locale),
    },
    integration: {
      ...integration,
      icon: {
        ...integration.icon,
        icon: integration.icon.icon as AllIconNames,
      },
      logos: (integration.logos ?? []).map(({ id, logo }) => ({
        id: id!,
        logo: resolveRelation(logo),
      })),
    },
  }

  const mappedNavLinks = Object.entries(navLinks).reduce(
    (acc, [key, value]) => {
      const navLink = key as keyof typeof navLinks
      const { activeIcon, defaultIcon, link } = value

      const parsedLink = parsePayloadLink(link)

      acc[navLink] = {
        link: parsedLink,
        activeIcon: {
          ...activeIcon,
          icon: activeIcon.icon as AllIconNames,
        },
        defaultIcon: {
          ...defaultIcon,
          icon: defaultIcon.icon as AllIconNames,
        },
      }

      return acc
    },
    {} as Record<
      keyof typeof navLinks,
      {
        link: string
        defaultIcon: { icon: AllIconNames; size: { width: number; height: number } }
        activeIcon: { icon: AllIconNames; size: { width: number; height: number } }
      }
    >,
  )

  const mappedHelpNavigation = helpNavigation.map(({ label, id, link }) => ({
    id: id!,
    label,
    link: parsePayloadLink(link),
  }))

  return (
    <MainNavigationClient
      navLinks={mappedNavLinks}
      defaultMenuHeader={defaultMenuHeader}
      search={search}
      navigation={mappedNavigation}
      helpNavigation={mappedHelpNavigation}
      logo={resolvedLogo!}
      logoUrl={logoUrl}
    />
  )
}
