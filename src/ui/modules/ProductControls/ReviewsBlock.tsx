'use client'
import { Feedback } from 'cms-types'
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { StarHalfFilled } from '@oleksii-lavka/grocee-icons/icons'
import Skeleton from 'react-loading-skeleton'
import { Button } from '../..'
import { useGlobalTypography } from 'store'
import clsx from 'clsx'

type Props = {
  className?: string
  // eslint-disable-next-line no-unused-vars
  fetchReviews: (page: number) => Promise<{
    docs: Feedback[]
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }>
  productId: string
  rating: number
}

export const ReviewsBlock: FC<Props> = ({
  fetchReviews,
  productId,
  rating,
  className = '',
}: Props) => {
  const [pageNumber, setPageNumber] = useState(1)
  const { productPage } = useGlobalTypography()

  const {
    data: reviews,
    isFetching,
    isLoading,
    isPending,
  } = useQuery({
    queryFn: async () => {
      const data = await fetchReviews(pageNumber)
      return data
    },
    queryKey: ['productReviews', productId, pageNumber],
  })

  if (!reviews?.docs.length && !isFetching && !isPending && !isLoading) {
    return (
      <div
        className={clsx(
          'flex h-[200px] items-center justify-center rounded bg-gray-25 p-4',
          className,
        )}
      >
        {productPage.reviewsBlock.emptyReviewListLabel ? (
          <p className='gilroy-md mx-auto text-balance font-light text-gray-800'>
            {productPage.reviewsBlock.emptyReviewListLabel}
          </p>
        ) : (
          <Skeleton className='block' width={200} height={32} />
        )}
      </div>
    )
  }

  return (
    <section className={clsx('flex flex-col gap-6 tablet:gap-8', className)}>
      <div className='flex flex-col gap-2'>
        {productPage.reviewsBlock.title ? (
          <>
            <h4 className='helvetica-xs font-light text-gray-900'>
              {productPage.reviewsBlock.title}
            </h4>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx}>
                    <StarHalfFilled width={15} height={14} />
                  </div>
                ))}
              </div>

              {rating}
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-2'>
            <Skeleton width={140} height={31} />
            <Skeleton width={200} height={24} />
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-8'>
        {isFetching ? (
          <>
            {Array.from({ length: 4 }).map(
              (_, idx) =>
                (isFetching || isLoading || isPending) && (
                  <div key={idx} className='col-span-full laptop:col-span-1'>
                    <Skeleton borderRadius={4} height={200} className='block w-full' />
                  </div>
                ),
            )}
          </>
        ) : (
          reviews?.docs.map(({ review, createdAt, id, rating, user }) => (
            <div
              className='col-span-full flex flex-col gap-2 rounded bg-gray-25 p-4 laptop:col-span-1 laptop:gap-4'
              key={id}
            >
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx}>
                      <StarHalfFilled width={10} height={9} />
                    </div>
                  ))}
                </div>
                <span className='gilroy-sm font-light text-gray-800'>{rating}</span>
              </div>

              <p className='gilroy-sm line-clamp-6 grow font-light text-gray-900'>{review}</p>

              <div className='flex items-center gap-3'>
                <span className='gilroy-sm font-light text-gray-900'>{user as string}</span>
                <span className='gilroy-xs inline-block pt-[2px] font-light text-gray-800'>
                  {createdAt}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='flex flex-col items-center gap-6 tablet:flex-row-reverse tablet:justify-between'>
        <div className='flex gap-2'>
          <PrevReviews
            onClick={() => setPageNumber(prev => (reviews?.hasPrevPage ? prev - 1 : prev))}
            isDisabled={!reviews?.hasPrevPage || isFetching || isLoading || isPending}
          />
          <NextReviews
            onClick={() => setPageNumber(prev => (reviews?.hasNextPage ? prev + 1 : prev))}
            isDisabled={!reviews?.hasNextPage || isFetching || isLoading || isPending}
          />
        </div>
        {productPage.reviewsBlock.logInToLeaveRivewLabel ? (
          <span className='gilroy-md text-balance font-light text-gray-800'>
            {productPage.reviewsBlock.logInToLeaveRivewLabel}
          </span>
        ) : (
          <Skeleton className='block' width={200} height={31} />
        )}
      </div>
    </section>
  )
}

function NextReviews({ isDisabled, onClick }: { isDisabled?: boolean; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowRight', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}

function PrevReviews({ isDisabled, onClick }: { isDisabled?: boolean; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      disableBorder={isDisabled}
      variant='tertiary'
      leftIcon={{ icon: 'ArrowLeft', size: { width: 14, height: 10 } }}
      className='h-10 w-10 rounded-[1000px]'
    />
  )
}
