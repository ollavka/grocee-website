import clsx from 'clsx'
import Link from 'next/link'
import React, { createElement } from 'react'
import { PayloadImage } from 'ui'
import { CheckCirleFilled } from '@oleksii-lavka/grocee-icons/icons'

import { pageToUrl, renderBlock, resolveRelation } from '@/cms/helpers'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './constants'
import { ChildrenNode, ListItemNode, Options } from './types'

export function richTextToJSX(rootNode?: any, options?: Options) {
  function mapListItems(
    node: ListItemNode,
    listType?: string,
    listParentValue?: string,
  ): JSX.Element {
    if (node.children[0].type !== 'list') {
      switch (listType) {
        case 'bullet':
          return (
            <span className='ml-2.5 mt-[3px] inline-block h-[6px] w-[6px] rounded-[50%] bg-gray-700' />
          )
        case 'check':
          return (
            <span className='ml-2.5 inline-block'>
              {node.checked && <CheckCirleFilled size={18} className='text-gray-700' />}
            </span>
          )
        case 'number':
          return (
            <span className='gilroy-md ml-2.5 inline-block text-gray-700'>{`${
              listParentValue ?? ''
            }${node.value}.`}</span>
          )
        default:
          return <></>
      }
    }
    return <></>
  }

  function parseLinkHref(node: ChildrenNode) {
    if (node.type !== 'link' && node.type !== 'autolink') {
      return ''
    }

    const { fields } = node

    switch (fields.linkType) {
      case 'internal':
        return pageToUrl(fields.doc) ?? ''

      case 'custom':
        return fields.url.includes(':') ? fields.url : `https://${node.fields.url}`

      default:
        return ''
    }
  }

  const parse = (
    children?: ChildrenNode[],
    textClassName?: string,
    nestedListLevel?: number,
    listType?: 'bullet' | 'number' | 'check',
    listParentValue?: string,
  ): (JSX.Element | null)[] => {
    return (
      children
        ?.map((node, index) => {
          if (node == null) {
            return null
          }

          switch (node.type) {
            case 'text':
              return createElement(
                node.format & IS_SUBSCRIPT ? 'sub' : node.format & IS_SUPERSCRIPT ? 'sup' : 'p',
                {
                  className: clsx(
                    'gilroy-lg inline font-light',
                    node.format & IS_BOLD && 'font-bold',
                    node.format & IS_ITALIC && 'italic',
                    node.format & IS_UNDERLINE && 'underline',
                    node.format & IS_STRIKETHROUGH && 'line-through',
                    node.format & IS_CODE && 'code',
                    options?.textClassName,
                    textClassName,
                  ),
                  key: index,
                  ['data-initial-text']: node.text,
                },
                node.text,
              )

            case 'link':
              if (!node.fields || node.fields?.doc?.relationTo === 'images') {
                return null
              }

              return (
                <Link
                  className={clsx(
                    'gilroy-sm ease inline-block text-gray-900 underline underline-offset-2 transition-colors duration-300 hover:text-gray-700',
                    {
                      left: 'text-left',
                      center: 'text-center',
                      right: 'text-right',
                    }[node.format],
                  )}
                  href={parseLinkHref(node)}
                  target={node.fields.newTab ? '_blank' : '_self'}
                  key={index}
                  rel='noreferrer nofollow'
                  style={{
                    paddingLeft: node.indent * 16,
                  }}
                >
                  {parse(node.children)}
                </Link>
              )

            case 'autolink':
              if (!node.fields || node.fields?.doc?.relationTo === 'images') {
                return null
              }

              return (
                <Link
                  className={clsx(
                    'gilroy-sm ease inline-block text-gray-900 underline underline-offset-2 transition-colors duration-300 hover:text-gray-700',
                    {
                      left: 'text-left',
                      center: 'text-center',
                      right: 'text-right',
                    }[node.format],
                  )}
                  href={parseLinkHref(node)}
                  target={node.fields.newTab ? '_blank' : '_self'}
                  key={index}
                  rel='noreferrer nofollow'
                  style={{
                    paddingLeft: node.indent * 16,
                  }}
                >
                  {parse(node.children)}
                </Link>
              )

            case 'heading':
              if (node.children?.[0]?.type !== 'text' || !node?.tag.startsWith('h')) {
                return <div className='my-8' />
              }

              const headingProps = (className?: string) => ({
                className: clsx(
                  'mb-4',
                  {
                    left: 'text-left',
                    center: 'text-center',
                    right: 'text-right',
                  }[node.format],
                  className,
                ),
                style: {
                  paddingLeft: node.indent * 16 || undefined,
                },
              })

              switch (node?.tag) {
                case 'h1':
                case 'h2': {
                  return (
                    <h2
                      key={`${node.tag}-${index}`}
                      {...headingProps(
                        'helvetica-md tablet:leading-[125%] tablet:text-[48px] laptop:text-[60px] laptop:leading-[120%] font-light text-gray-900',
                      )}
                    >
                      {parse(node.children)}
                    </h2>
                  )
                }
                case 'h3': {
                  return (
                    <h3
                      key={`${node.tag}-${index}`}
                      {...headingProps(
                        'helvetica-sm tablet:text-[36px] tablet:leading-[122%] laptop:text-[48px] laptop:leading-[125%] tablet:tracking-tightest font-light text-gray-900',
                      )}
                    >
                      {parse(node.children)}
                    </h3>
                  )
                }
                case 'h4':
                case 'h5':
                case 'h6': {
                  return (
                    <h4
                      key={`${node.tag}-${index}`}
                      {...headingProps('helvetica-xs font-light text-gray-900')}
                    >
                      {parse(node.children)}
                    </h4>
                  )
                }
              }

            case 'quote':
              return (
                <div className='gilroy-md mb-2 text-gray-700' key={index}>
                  {parse(node.children, textClassName ?? '')}
                </div>
              )

            case 'paragraph':
              if (!node?.children.length) {
                return <div key={index} className='h-8 w-full' />
              }

              return (
                <div
                  className={clsx(
                    'mb-2',
                    {
                      left: 'text-left',
                      center: 'text-center',
                      right: 'text-right',
                    }[node.format],
                  )}
                  style={{
                    paddingLeft: node.indent * 16 || undefined,
                  }}
                  key={index}
                >
                  {parse(node.children, textClassName ?? '')}
                </div>
              )

            case 'list':
              return createElement(
                node.tag,
                {
                  className: clsx(
                    'flex flex-col gap-1',
                    {
                      bullet: 'list-disc',
                      number: 'list-decimal',
                      check: 'list-none',
                    }[node.listType],
                    {
                      left: 'text-left',
                      center: 'text-center',
                      right: 'text-right',
                    }[node.format],
                  ),
                  key: index,
                },
                parse(
                  node.children,
                  textClassName ?? '',
                  nestedListLevel == null ? 1 : nestedListLevel + 1,
                  node.listType,
                  listParentValue ?? '',
                ),
              )

            case 'listitem':
              return (
                <li
                  className={clsx(
                    'gilroy-md flex items-center gap-2.5 text-gray-700',
                    {
                      left: 'justify-start text-left',
                      center: 'justify-center text-center',
                      right: 'justify-end text-right',
                    }[node.format],
                    {
                      'items-center gap-2.5': listType === 'check',
                      'list-none': node.children[0].type === 'list',
                    },
                  )}
                  style={{
                    paddingLeft: node.indent === 0 ? undefined : 16,
                  }}
                  key={index}
                >
                  {mapListItems(node, listType, listParentValue)}
                  {parse(
                    node.children,
                    textClassName ?? '',
                    nestedListLevel,
                    undefined,
                    `${listParentValue ?? ''}${node.value === 1 ? '' : node.value - 1 + '.'}`,
                  )}
                </li>
              )

            case 'upload':
              return (
                <PayloadImage
                  key={index}
                  src={resolveRelation(node.value)}
                  className='my-8 w-full overflow-hidden rounded-lg'
                />
              )
            case 'linebreak':
              return <br key={index} />
            case 'block':
              return (
                <div key={index} className='my-8'>
                  {/* @ts-ignore */}
                  {renderBlock(node.fields)}
                </div>
              )

            default:
              return null
          }
        })
        ?.filter(node => node != null) ?? []
    )
  }

  return parse(rootNode?.root.children)
}

export function getTextFromRichText(rootNode?: any) {
  let result = ''

  const parse = (children?: ChildrenNode[]) => {
    children?.forEach(node => {
      if (node == null) {
        return null
      }

      switch (node.type) {
        case 'text':
          result += node.text
          break

        default:
          parse('children' in node ? node.children : undefined)
      }
    })
  }

  parse(rootNode?.root.children)

  return result
}
