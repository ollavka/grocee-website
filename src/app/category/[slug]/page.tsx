import {
  getCollection,
  getCollectionItemByUniqueField,
  getMetadata,
  getPage,
  getProductsCountByFilters,
  getProductsCountBySubcategories,
} from '@/cms'
import { renderBlocks } from '@/cms/helpers'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import { NextRoute } from '@/types'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from 'ui'
import { mapBreadcrumbs } from 'ui/helpers'
import { CategoryHeader } from '@/components/CategoryPage/CategoryHeader'
import { revalidateTag } from 'next/cache'
import { ProductList } from '@/components/CategoryPage/ProductList'
import { ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const categories = await getCollection('categories', { searchParams: { limit: '100' } })

  return categories.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('categories', params.slug, { searchParams: { locale } }, parent)
}

export default async function CategoryPage({ params, searchParams }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const [page, category] = await Promise.all([
      getPage('pages', 'category', { searchParams: { locale }, throwOnNotFound: true }),
      getCollectionItemByUniqueField('categories', 'slug', params.slug),
    ])

    if (!page || !category) {
      notFound()
    }

    const { subcat = '' } = searchParams

    const countries = decodeURIComponent((searchParams?.countries ?? '') as string) || ''
    const specials = decodeURIComponent((searchParams?.specials ?? '') as string) || ''
    const tags = decodeURIComponent((searchParams?.tags ?? '') as string) || ''
    const trademarks = decodeURIComponent((searchParams?.trademarks ?? '') as string) || ''
    const minPrice = searchParams?.minPrice || ''
    const maxPrice = searchParams?.maxPrice || ''

    const [{ filters }, { subcategories, totalProducts }] = await Promise.all([
      getProductsCountByFilters({
        subcategorySlug: subcat,
        categoryId: category.id,
        countries,
        specials,
        tags,
        trademarks,
        price: {
          min: minPrice,
          max: maxPrice,
        },
      }),
      getProductsCountBySubcategories({
        subcategorySlug: subcat,
        categoryId: category.id,
        countries,
        specials,
        tags,
        trademarks,
        price: {
          min: minPrice,
          max: maxPrice,
        },
      }),
    ])

    const updateProductsCount = async () => {
      'use server'

      revalidateTag('productsCount')
    }

    const { breadcrumbs, breadcrumbsTitle } = page

    const mappedBreadcrumbs = mapBreadcrumbs(breadcrumbs, {
      labelReplace: { from: breadcrumbsTitle as string, to: category.label },
      urlReplace: { from: breadcrumbsTitle as string, to: category.slug },
    })

    return (
      <>
        <SetupEdgeBlocksOnPage layout={page.layout ?? []} />
        <div className='width-limit mt-[120px] flex flex-col gap-8 tablet:mt-[150px]'>
          <Breadcrumbs breadcrumbs={mappedBreadcrumbs} />
          <CategoryHeader
            totalProducts={totalProducts}
            subcategories={subcategories}
            filters={filters}
            category={category}
            updateProductsCount={updateProductsCount}
          />
          <ProductList categoryId={category.id} />
        </div>
        {(page?.layout?.length ?? 0) > 0 && (
          <div className='mt-10 flex flex-col gap-16 laptop:mt-20 laptop:gap-20'>
            {renderBlocks(page.layout)}
          </div>
        )}
      </>
    )
  } catch (err: unknown) {
    notFound()
  }
}
