'use client'

import { FC } from 'react'
import { useIsSSR } from 'react-aria'

type FunctionComponent = (
  // eslint-disable-next-line no-unused-vars
  ...args: any[]
) => JSX.Element | null | Promise<JSX.Element | null>

type ComponentType = FC | FC<any> | FunctionComponent

export function WithSkeletonLoader(
  WrappedComponent: ComponentType,
  SkeletonLoader?: ComponentType,
) {
  return (props: any) => {
    const isSSR = useIsSSR()

    if (isSSR && SkeletonLoader) {
      return <SkeletonLoader {...props} />
    }

    return <WrappedComponent {...props} />
  }
}
