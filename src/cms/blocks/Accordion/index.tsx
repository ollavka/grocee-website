import { parsePayloadLink } from '@/helpers/parsePayloadLink'
import { AllIconNames } from '@oleksii-lavka/grocee-icons'
import { AccordionBlock } from 'cms-types'
import { AccordionClient } from './AccordionClient'

export async function Accordion({ accordionList, link, withoutLink }: AccordionBlock) {
  const mappedPanels = (accordionList ?? []).map(({ id, title, content }) => {
    return {
      id: id!,
      title: title ?? '',
      content: content ?? '',
    }
  })

  const mappedLink = {
    label: link?.label ?? '',
    href: parsePayloadLink(link),
    icon: {
      icon: link?.icon.icon as AllIconNames,
      size: link?.icon.size,
    },
  }

  return (
    <AccordionClient withoutLink={withoutLink ?? false} panels={mappedPanels} link={mappedLink} />
  )
}
