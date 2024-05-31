import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
  history: {
    id: string
    text: string
  }[]
  itemForPush: string | null
  setItemForPush: (search: string | null) => void
  addHistoryItem: (search: string) => void
  removeHistoryItem: (id: string) => void
}

export const useSearchHistory = create<Store>()(
  persist(
    (set, get) => ({
      history: [],
      itemForPush: null,
      setItemForPush: search => {
        set({ itemForPush: search ? decodeURIComponent(search) : null })
      },
      addHistoryItem: search => {
        const currentHistory = get().history
        const newItem = { id: crypto.randomUUID(), text: decodeURIComponent(search) }

        if (currentHistory.length >= 5) {
          set({ history: [newItem, ...currentHistory.slice(0, 4)] })

          return
        }

        set({ history: [newItem, ...currentHistory] })
      },
      removeHistoryItem: targetId => {
        const currentHistory = get().history

        const filteredHistory = currentHistory.filter(({ id }) => id !== targetId)

        set({ history: filteredHistory })
      },
    }),
    {
      name: 'searchHistory',
      skipHydration: true,
      partialize: ({ history }) => ({
        history,
      }),
    },
  ),
)
