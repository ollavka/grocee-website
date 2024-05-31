'use client'

import { ComponentProps, FC } from 'react'
import { Cooperation as CooperationUI } from 'ui'

type Props = ComponentProps<typeof CooperationUI>

export const CooperationClient: FC<Props> = props => {
  return <CooperationUI {...props} />
}
