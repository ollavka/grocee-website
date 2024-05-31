import { create } from 'zustand'
import { AnyBlock } from '../cms/blocks'

type Store = {
  firstBlockOnPage: AnyBlock['blockType'] | null
  lastBlockOnPage: AnyBlock['blockType'] | null
  updateBlock: (args: {
    firstBlockOnPage?: AnyBlock['blockType'] | null
    lastBlockOnPage?: AnyBlock['blockType'] | null
  }) => void
}

export const useEdgeBlocksOnPage = create<Store>(set => ({
  firstBlockOnPage: null,
  lastBlockOnPage: null,
  updateBlock: ({ firstBlockOnPage, lastBlockOnPage }) => {
    set({
      firstBlockOnPage,
      lastBlockOnPage,
    })
  },
}))
