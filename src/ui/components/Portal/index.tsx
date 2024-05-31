'use client'

import { FC, ReactNode, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  wrapperId: string
  children: ReactNode
}

const createWrapperAndAppedToBody = (wrapperId: string) => {
  if (!document) {
    return null
  }

  const wrapperElement = document.createElement('dialog')
  wrapperElement.setAttribute('id', wrapperId)
  document.body.appendChild(wrapperElement)
  return wrapperElement
}

export const Portal: FC<Props> = ({ children, wrapperId }) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId)
    let systemCreated = false

    if (!element) {
      systemCreated = true
      element = createWrapperAndAppedToBody(wrapperId)
    }

    setWrapperElement(element)

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [wrapperId])

  if (!wrapperElement) {
    return null
  }

  return createPortal(children, wrapperElement)
}
