import { Image, Page } from 'cms-types'

import { AnyBlock } from '@/cms/blocks'

type TextNode = {
  detail: number
  mode: 'normal'
  text: string
  type: 'text'
  format: number
  style: string
}

type LinkNode = {
  children: ChildrenNode[]
  fields: {
    linkType: 'custom' | 'internal'
    url: string
    newTab?: boolean
    doc?: {
      value: Page
      relationTo: string
    }
  }
  type: 'link'
  indent: number
  format: 'left' | 'center' | 'right'
  direction: 'rtl' | 'ltr' | null
}
type AutoLinkNode = {
  children: ChildrenNode[]
  fields: {
    linkType: 'custom' | 'internal'
    url: string
    newTab?: boolean
    doc?: {
      value: Page
      relationTo: string
    }
  }
  type: 'autolink'
  indent: number
  format: 'left' | 'center' | 'right'
  direction: 'rtl' | 'ltr' | null
}

type ParagraphNode = {
  children: ChildrenNode[]
  type: 'paragraph'
  indent: number
  format: 'left' | 'center' | 'right'
  direction: 'rtl' | 'ltr' | null
}

export type HeadingNode = {
  children: ChildrenNode[]
  direction: 'rtl' | 'ltr' | null
  format: 'left' | 'center' | 'right'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  indent: number
  type: 'heading'
}

type BlockquoteNode = {
  children: ChildrenNode[]
  direction: 'rtl' | 'ltr' | null
  type: 'quote'
  indent: number
  format: 'left' | 'center' | 'right'
}

export type ListNode = {
  children: ChildrenNode[]
  type: 'list'
  listType: 'bullet' | 'number' | 'check'
  start: number
  direction: 'rtl' | 'ltr' | null
  format: 'left' | 'center' | 'right'
  tag: 'ul' | 'ol'
  indent: number
  value: number
}

export type ListItemNode = {
  checked?: boolean
  type: 'listitem'
  value: number
  indent: number
  format: 'left' | 'center' | 'right'
  direction: 'rtl' | 'ltr' | null
  children: ChildrenNode[]
}

type UploadNode = {
  fields: null
  type: 'upload'
  format: 'left' | 'center' | 'right'
  direction: 'rtl' | 'ltr' | null
  relationTo: string
  value: Image | string
  children: ChildrenNode[]
}

type BlockNode = {
  type: 'block'
  fields: {
    data: AnyBlock
  }
}

export type ChildrenNode =
  | HeadingNode
  | ParagraphNode
  | TextNode
  | LinkNode
  | AutoLinkNode
  | BlockquoteNode
  | ListNode
  | ListItemNode
  | UploadNode
  | BlockNode
  | LineBreakNode

type LineBreakNode = {
  type: 'linebreak'
  version: number
}
type RootNode = {
  children: ChildrenNode[]
  type: 'root'
  indent: number
  format: string
  direction: 'rtl' | 'ltr' | null
}

export type RichText = {
  root: RootNode
}

export type Options = {
  textOnly?: boolean
  textClassName?: string
}
