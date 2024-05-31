import { getCollectionItem, getMetadata, getPage, getPaginatedCollection } from '@/cms'
import { pageToUrl, renderBlocks, resolveRelation } from '@/cms/helpers'
import { SetupEdgeBlocksOnPage } from '@/components/SetupEdgeBlocksOnPage'
import { NextRoute } from '@/types'
import { Category, Subcategory } from 'cms-types'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Breadcrumbs, Breadcrumb } from 'ui'
import { ProductIntro } from './product-intro'
import { mapCMSProducts } from '@/helpers/mapCMSProducts'
import { ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: NextRoute, parent: ResolvingMetadata) {
  const locale = cookies().get('locale')?.value ?? 'en'

  return await getMetadata('productPages', params.slug, { searchParams: { locale } }, parent)
}

export default async function ProductPage({ params, searchParams }: NextRoute) {
  const locale = cookies().get('locale')?.value || 'en'

  try {
    const [productPage, homePage] = await Promise.all([
      getPage('productPages', params.slug, {
        searchParams: { locale },
        throwOnNotFound: true,
      }),
      getPage('pages', 'home', {
        searchParams: { locale },
        throwOnNotFound: true,
      }),
    ])

    const product =
      typeof productPage.product === 'string'
        ? await getCollectionItem(productPage.product, 'products', { searchParams: { locale } })
        : productPage.product

    if (!product) {
      notFound()
    }

    const productGallery = (productPage.productIntro?.images ?? []).map(({ image, id }) => ({
      id: id!,
      image: resolveRelation(image)!,
    }))

    const [mappedProduct] = await mapCMSProducts([product], locale)

    const firstSubcategory = (
      typeof product.subcategories?.[0] === 'string'
        ? await getCollectionItem(product.subcategories?.[0], 'subcategories', {
            searchParams: { locale },
          })
        : product.subcategories?.[0]
    )!

    const breadcrumbs: Breadcrumb[] = [
      {
        label: homePage.breadcrumbsTitle!,
        url: '/',
      },
      {
        label: (product.category as Category).label,
        url: pageToUrl({ relationTo: 'categories', value: product.category }) as string,
      },
      {
        label: firstSubcategory.label,
        url: `${pageToUrl({ relationTo: 'categories', value: product.category }) as string}?subcat=${firstSubcategory.slug}`,
      },
      {
        label: product.name,
        url: pageToUrl({ relationTo: 'productPages', value: productPage }) as string,
      },
    ]

    const fetchReviews = async (page: number) => {
      'use server'

      const { docs, ...restData } = await getPaginatedCollection(
        'feedbacks',
        {
          where: 'product',
          equals: product.id,
          sortBy: '-createdAt',
          pageLimit: 4,
          page,
        },
        { searchParams: { locale } },
      )

      const mappedData = await Promise.all(
        docs.map(async ({ product, user, createdAt, ...restProduct }) => {
          const [resolvedProduct, resolvedUser] = await Promise.all([
            typeof product === 'string' ? getCollectionItem(product, 'products') : product,
            typeof user === 'string' ? getCollectionItem(user, 'users') : user,
          ])

          const userName = `${resolvedUser.name}${resolvedUser.lastName ? ` ${resolvedUser.lastName}` : ''}`
          const mappedCreatedAt = new Date(createdAt).toLocaleDateString(locale, {
            month: 'long',
            day: 'numeric',
          })

          return {
            user: userName,
            product: resolvedProduct,
            createdAt: mappedCreatedAt,
            ...restProduct,
          }
        }),
      )

      return {
        ...restData,
        docs: mappedData,
      }
    }

    return (
      <>
        <SetupEdgeBlocksOnPage layout={productPage.layout ?? []} />
        <div className='width-limit mt-[120px] flex flex-col gap-8 tablet:mt-[150px]'>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <ProductIntro
            fetchReviews={fetchReviews}
            productGallery={productGallery}
            product={mappedProduct}
          />
        </div>
        {(productPage.layout?.length ?? 0) > 0 && (
          <div className='mt-10 flex flex-col gap-16 laptop:mt-20 laptop:gap-20'>
            {renderBlocks(productPage.layout)}
          </div>
        )}
      </>
    )
  } catch (err: unknown) {
    notFound()
  }
}
