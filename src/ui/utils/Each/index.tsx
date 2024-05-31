/* eslint-disable no-unused-vars */
import { Children, ReactNode, Key, Fragment } from 'react'
import { uniqueId } from 'lodash'

type Props<T> = {
  of: Array<T>
  render: (item: T, index: number) => ReactNode
  generateKey?: (item: T, index: number) => Key
  prefixKey?: string
}

export function Each<T>({ render, of, generateKey, prefixKey }: Props<T>) {
  return Children.toArray(
    of.map((item, index) => {
      const key = generateKey ? generateKey(item, index) : uniqueId(prefixKey)

      return <Fragment key={key}>{render(item, index)}</Fragment>
    }),
  )
}
