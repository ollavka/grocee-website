'use client'

import { useGlobalTypography } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { FC, useRef } from 'react'
import { NewsCard as NewsCardUI, Pagination } from 'ui'
import { NewsCardSkeleton } from 'ui/skeletons'
import { MappedNewsArticleCard } from 'ui/types'

type Props = {
  fetchNews: (page?: number) => Promise<{
    news: MappedNewsArticleCard[]
    totalDocs: number
    totalPages: number
  }>
  title?: string
}

export const NewsList: FC<Props> = ({ fetchNews, title }) => {
  const { errorSearchResultTitle } = useGlobalTypography(state => state.newsPage)

  const searchParams = useSearchParams()
  const page = +(searchParams.get('page') || 1)

  const cachedTotalPagesCount = useRef(0)

  const {
    data: news,
    isError,
    error,
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ['news', page],
    queryFn: async () => {
      const { news, totalPages } = await fetchNews(page)

      cachedTotalPagesCount.current = totalPages

      return news
    },
  })

  if (isError) {
    return (
      <div className='flex flex-col gap-4 laptop:gap-8'>
        {title && (
          <h1 className='helvetica-xs font-light leading-[122%] text-gray-900 tablet:text-[36px] tablet:tracking-tightest'>
            {title}
          </h1>
        )}
        <p className='helvetica font-light text-error-600'>
          {errorSearchResultTitle || error.message}
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 laptop:gap-8'>
      {title && (
        <h1 className='helvetica-xs font-light leading-[122%] text-gray-900 tablet:text-[36px] tablet:tracking-tightest'>
          {title}
        </h1>
      )}
      {isLoading || isFetching || isPending || !errorSearchResultTitle ? (
        <ul className='grid-layout !gap-6 laptop:!gap-y-8'>
          {Array.from({ length: 12 }).map((_, idx) => (
            <li className='col-span-full mobile:col-span-2 laptop:col-span-3' key={idx}>
              <NewsCardSkeleton />
            </li>
          ))}
        </ul>
      ) : (
        <ul className='grid-layout !gap-6 laptop:!gap-y-8'>
          {(news ?? []).map(({ id, link, previewImage, title, titleColor, tag }, idx) => (
            <li className='col-span-full mobile:col-span-2 laptop:col-span-3' key={`${id}-${idx}`}>
              <NewsCardUI
                link={link}
                title={title}
                titleColor={titleColor}
                image={previewImage}
                tag={tag}
              />
            </li>
          ))}
        </ul>
      )}
      {(cachedTotalPagesCount.current ?? 0) > 1 && (
        <Pagination
          className='mt-4 laptop:mt-8'
          page={+page}
          totalPages={cachedTotalPagesCount.current ?? 0}
        />
      )}
    </div>
  )
}
