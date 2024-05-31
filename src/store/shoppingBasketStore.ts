import axios from 'axios'
import { Checkout, MappedProduct } from 'ui/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LineItem = MappedProduct & { quantity?: number; addedAt?: Date }

type Store = {
  checkoutId: string | null
  lineItems: LineItem[]
  setCheckoutId: (checkoutId: string | null) => void
  setLineItems: (lineItems: LineItem[]) => void
  addLineItem: (lineItem: LineItem) => LineItem[]
  clearLineItems: () => void
  removeLineItem: (id: string, options?: { full?: boolean }) => void
}

export const useShoppingBasket = create<Store>()(
  persist(
    (set, get) => ({
      lineItems: [],
      checkoutId: null,
      setCheckoutId: checkoutId => {
        set({ checkoutId })
      },
      setLineItems: lineItems => {
        set({
          lineItems: lineItems.toSorted(
            // @ts-ignore
            (a, b) => new Date(b?.addedAt ?? '') - new Date(a?.addedAt ?? ''),
          ),
        })
      },
      addLineItem: lineItem => {
        const { quantity = 1 } = lineItem

        let newLineItems: LineItem[] = [...get().lineItems]
        const foundLineItem = newLineItems.find(({ id }) => id === lineItem.id)

        if (foundLineItem) {
          newLineItems = [
            ...newLineItems.filter(({ id }) => id !== lineItem.id),
            { ...foundLineItem, quantity: (foundLineItem.quantity ?? 1) + quantity },
          ]
        } else {
          newLineItems.push({ ...lineItem, quantity, addedAt: new Date() })
        }

        set({
          lineItems: newLineItems.toSorted(
            // @ts-ignore
            (a, b) => new Date(b?.addedAt ?? '') - new Date(a?.addedAt ?? ''),
          ),
        })

        return newLineItems
      },
      removeLineItem: (lineItemId, options) => {
        const newLineItems = [...get().lineItems].map(lineItem => {
          const { id, quantity } = lineItem

          if (id !== lineItemId) {
            return lineItem
          }

          if ((quantity ?? 1) > 1 && !options?.full) {
            return {
              ...lineItem,
              quantity: quantity! - 1,
            }
          }

          return null
        })

        set({
          lineItems: newLineItems.filter(Boolean).toSorted(
            // @ts-ignore
            (a, b) => new Date(b?.addedAt ?? '') - new Date(a?.addedAt ?? ''),
          ) as LineItem[],
        })
      },
      clearLineItems: () => {
        set({ lineItems: [] })
      },
    }),
    {
      name: 'shoppingBasket',
      partialize: ({ lineItems, checkoutId }) => ({
        lineItems,
        checkoutId,
      }),
      skipHydration: true,
    },
  ),
)
