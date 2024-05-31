import { Config } from 'cms-types'

import { MainSlider } from './MainSlider'
import { Carousel } from './Carousel'
import { Banner } from './Banner'
import { Cooperation } from './Cooperation'
import { Accordion } from './Accordion'
import { HelpBlock } from './HelpBlock'
import { RichText } from './RichText'
import { ImageWithText } from './ImageWithText'

export type AnyBlock = NonNullable<Config['globals']['allBlocks']['blocks']>[number]

export const blocks: Record<
  AnyBlock['blockType'],
  (...args: any[]) => JSX.Element | null | Promise<JSX.Element | null>
> = {
  MainSlider,
  Carousel,
  Banner,
  Cooperation,
  Accordion,
  HelpBlock,
  RichText,
  ImageWithText,
}
