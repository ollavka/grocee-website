'use client'

import { RichTextBlock } from 'cms-types'

import { richTextToJSX } from '@/helpers/richTextParser'
import { useSSR } from '@/hooks'
import { RichTextSkeleton } from 'ui/skeletons'

export function RichText({ content }: RichTextBlock) {
  const { isServer } = useSSR()

  if (isServer) {
    return <RichTextSkeleton />
  }

  return <div>{richTextToJSX(content)}</div>
}
