import { SelectProps } from '.'

type AnimationOrigin<T> = NonNullable<SelectProps<T>['animationOrigin']>

export type Swap<T, U extends keyof NonNullable<SelectProps<T>['listPosition']>> = {
  from: NonNullable<NonNullable<SelectProps<T>['listPosition']>[U]>
  to: NonNullable<NonNullable<SelectProps<T>['listPosition']>[U]>
}

function swap<T, U extends keyof NonNullable<SelectProps<T>['listPosition']>>(
  direction: AnimationOrigin<T>,
  { from, to }: Swap<T, U>,
) {
  return direction.replace(new RegExp(from, 'g'), to) as AnimationOrigin<T>
}

export function swapDirection<T>(
  direction: AnimationOrigin<T>,
  replaceHorizontal?: Swap<T, 'horizontal'> | null,
  replaceVertical?: Swap<T, 'vertical'> | null,
): NonNullable<SelectProps<T>['animationOrigin']> {
  let swappedDirection = direction

  if (replaceVertical) {
    swappedDirection = swap(swappedDirection, replaceVertical)
  }

  if (replaceHorizontal) {
    swappedDirection = swap(swappedDirection, replaceHorizontal)
  }

  return swappedDirection
}
