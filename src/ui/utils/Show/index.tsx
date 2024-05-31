import { FC, Children, PropsWithChildren, ReactNode, isValidElement } from 'react'

type WhenProps = PropsWithChildren & {
  isTrue: boolean
}

type ElseProps = PropsWithChildren & {
  render?: ReactNode
}

type ShowComponent = FC<PropsWithChildren> & {
  When: FC<WhenProps>
  Else: FC<ElseProps>
}

export const Show: ShowComponent = ({ children }) => {
  let when: ReactNode = null
  let otherwise: ReactNode = null

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (!child?.props.isTrue) {
        otherwise = child
      } else if (!when && child?.props.isTrue) {
        when = child
      }
    }
  })

  return when || otherwise
}

Show.When = ({ isTrue, children }: WhenProps) => (isTrue ? <>{children}</> : null)

Show.Else = ({ render, children }: ElseProps) => (render ? <>{render}</> : <>{children}</>)
