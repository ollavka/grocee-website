import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'

export const RichTextSkeleton: FC = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='!block w-full' height={40} count={3} borderRadius={8} />
      <Skeleton className='!block w-full' height={200} borderRadius={8} />
      <Skeleton className='!block w-full' height={40} count={4} borderRadius={8} />
    </div>
  )
}
