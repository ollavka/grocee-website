import Skeleton from 'react-loading-skeleton'

export default function Loading() {
  return (
    <div className='width-limit mt-[120px] flex flex-col gap-4 tablet:mt-[150px] laptop:gap-8'>
      <Skeleton height={100} className='!block w-full' borderRadius={8} />
      <Skeleton height={60} className='!block w-full' borderRadius={8} />
      <div className='flex flex-col gap-4 laptop:flex-row laptop:gap-14'>
        <div className='w-full basis-[50%]'>
          <Skeleton height={310} borderRadius={16} className='!block' />
        </div>
        <div className='w-full basis-[50%]'>
          <Skeleton height={40} count={5} className='!block w-full' borderRadius={8} />
        </div>
      </div>
      <Skeleton height={200} className='!block w-full' borderRadius={8} />
      <Skeleton height={100} className='!block w-full' borderRadius={8} />
    </div>
  )
}
