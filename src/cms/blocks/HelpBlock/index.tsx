import { HelpBlock as HelpBlockType } from 'cms-types'
import { Accordion } from '../Accordion'
import { HelpBlockClient } from './HelpBlockClient'

export function HelpBlock({ accordion, title }: HelpBlockType) {
  const [accordionBlock] = accordion

  return (
    <HelpBlockClient
      accordionBlock={<Accordion {...accordionBlock} />}
      title={title ?? undefined}
    />
  )
}
