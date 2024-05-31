import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Store = {
  prevPath: string | null
  updatePrevPath: (path: string | null) => void
}

export const usePrevPath = create<Store>()(
  persist(
    set => ({
      prevPath: null,
      updatePrevPath: path => {
        set({ prevPath: path })
      },
    }),
    {
      name: 'prevPath',
      partialize: ({ prevPath }) => ({ prevPath }),
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    },
  ),
)
