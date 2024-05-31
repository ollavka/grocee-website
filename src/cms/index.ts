import { AxiosError } from 'axios'
import {
  Category,
  Config,
  Country,
  Image,
  NewsPage,
  Page,
  Product,
  ProductPage,
  Special,
  Subcategory,
  Tag,
  Trademark,
} from 'cms-types'
import { Metadata, ResolvedMetadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { resolveRelation } from './helpers'

export const CMS_URL = process.env.PAYLOAD_INTERNAL_URL ?? process.env.NEXT_PUBLIC_PAYLOAD_URL

const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    error != null &&
    typeof error === 'object' &&
    ('response' in error || 'request' in error || 'message' in error) &&
    'toJSON' in error
  )
}

const getCmsSearchParams = (searchParams: Record<string, string | string[]> = {}) => {
  const validParams = ['locale', 'depth', 'limit', 'page']

  const params = Object.entries(searchParams)
    .filter(param => {
      const [key] = param

      return validParams.includes(key)
    })
    .reduce((acc, param) => {
      const [key, value] = param

      if (acc.some((p: string) => p.includes(key))) {
        return acc
      }

      // @ts-ignore
      acc.push(`${key as string}=${Array.isArray(value) ? value[0] : value}`)

      return acc
    }, [])
    .join('&')

  return params
}

type PageTypes = {
  pages: Page
  productPages: ProductPage
  categories: Category
  newsPages: NewsPage
}

export const getPage = async <C extends keyof PageTypes>(
  collection: C,
  slug: string,
  {
    searchParams = {},
    throwOnNotFound = false,
  }: {
    searchParams?: Record<string, string | string[]>
    throwOnNotFound?: boolean
  } = {},
): Promise<PageTypes[C]> => {
  try {
    const url = `${CMS_URL}/api/${collection}?${getCmsSearchParams(
      searchParams,
    )}&where[slug][equals]=${slug}`

    const response = await fetch(url)

    if (process.env['NODE_ENV'] === 'production') {
      console.log(`CMS REQ PAGE [${response.status}]:`, url)
    }

    const page = (await response.json()) as { docs: PageTypes[C][]; totalDocs: number }

    if (page.totalDocs === 0) {
      if (throwOnNotFound) {
        throw new Error(`Page ${slug} not found`)
      }
    }

    return page.docs[0]
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching page ${slug}:`, error.toJSON())
    } else {
      console.error(`Error fetching page ${slug}:`, error)
    }
    throw error
  }
}

export const getGlobal = async <T extends keyof Config['globals']>(
  global: T,
  {
    searchParams = {},
  }: {
    searchParams?: Record<string, string | string[]>
  } = {},
): Promise<Config['globals'][T]> => {
  const url = `${CMS_URL}/api/globals/${global}?${getCmsSearchParams(searchParams)}`

  const response = await fetch(url)

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ GLOBAL [${response.status}]:`, url)
  }

  return await response.json()
}

export const getCollection = async <T extends keyof Config['collections']>(
  collection: T,
  {
    searchParams = {},
  }: {
    searchParams?: Record<string, string | string[]>
  } = {},
): Promise<Config['collections'][T][]> => {
  const url = `${CMS_URL}/api/${collection}?${getCmsSearchParams(searchParams)}`

  const response = await fetch(url)

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ COLLECTION [${response.status}]:`, url)
  }

  const { docs } = await response.json()

  return docs
}

export const getCollectionItem = async <T extends keyof Config['collections']>(
  id: string,
  collection: T,
  {
    searchParams = {},
  }: {
    searchParams?: Record<string, string | string[]>
  } = {},
): Promise<Config['collections'][T]> => {
  const url = `${CMS_URL}/api/${collection}/${id}?${getCmsSearchParams(searchParams)}`

  const response = await fetch(url)

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ ITEM [${response.status}]:`, url)
  }

  return (await response.json()) as Promise<Config['collections'][T]>
}

export const getCollectionItemByUniqueField = async <C extends keyof Config['collections']>(
  collection: C,
  field: string,
  equals: string,
  {
    searchParams = {},
    throwOnNotFound = false,
  }: {
    searchParams?: Record<string, string | string[]>
    throwOnNotFound?: boolean
  } = {},
): Promise<Config['collections'][C]> => {
  try {
    const url = `${CMS_URL}/api/${collection}?${getCmsSearchParams(
      searchParams,
    )}&where[${field}][equals]=${equals}`

    const response = await fetch(url, {
      next: { revalidate: 0 },
    })

    if (process.env['NODE_ENV'] === 'production') {
      console.log(`CMS REQ ITEM_BY_ID [${response.status}]:`, url)
    }

    const item = (await response.json()) as { docs: Config['collections'][C][]; totalDocs: number }

    if (item.totalDocs === 0) {
      if (throwOnNotFound) {
        throw new Error(`Item with ${field}=${equals} not found`)
      } else {
        notFound()
      }
    }

    return item.docs[0]
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error fetching item with ${field}=${equals}:`, error.toJSON())
    } else {
      console.error(`Error fetching item with ${field}=${equals}:`, error)
    }
    throw error
  }
}

export const getPaginatedCollection = async <T extends keyof Config['collections']>(
  collection: T,
  {
    where = '',
    equals = '',
    greater_than_equal = '',
    page = 1, // Add page parameter with a default value of 1
    pageLimit = 10, // Add pageSize parameter with a default value of 10
    sortBy = '',
  }: {
    where?: string
    equals?: string
    greater_than_equal?: string | number
    page?: number
    pageLimit?: number
    sortBy?: string
  } = {},
  {
    searchParams = {},
  }: {
    searchParams?: Record<string, string | string[]>
  } = {},
) => {
  const whereParam = equals ? 'equals' : 'greater_than_equal'

  const url = `${CMS_URL}/api/${collection}?${getCmsSearchParams(searchParams)}&${
    where &&
    (equals || greater_than_equal) &&
    `where[${where}][${whereParam}]=${equals ? equals : greater_than_equal}&`
  }page=${page}&limit=${pageLimit}&sort=${sortBy}`

  const response = await fetch(url)

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ PAGINATED [${response.status}]:`, url)
  }

  const responseJson = (await response.json()) as {
    docs: Config['collections'][T][]
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }

  return responseJson
}

export const getMetadata = async (
  collection: keyof PageTypes,
  slug: string,
  {
    searchParams = {},
  }: {
    searchParams?: Record<string, string | string[]>
  } = {},
  parent?: ResolvingMetadata,
): Promise<Metadata> => {
  try {
    const parentMetadata = (await parent) ?? ({} as ResolvedMetadata)
    const page = await getPage(collection, slug, { searchParams })

    return {
      title: page?.meta?.title ?? parentMetadata.title,
      description: page?.meta?.description ?? parentMetadata.description,
      openGraph: {
        images:
          resolveRelation(page?.meta?.image as Image)?.url ?? parentMetadata.openGraph?.images,
      },
    }
  } catch (error) {
    console.error('Failed to resolve metadata', error)

    return {}
  }
}

type SearchInCollectionOptions = {
  /**
   * The key to search within the collection. For nested keys, use `.` notation:
   * ```javascript
   *  'object.key.nestedKey.anotherNestedKey'
   * ```
   *
   * Also support multiple key search within the collection:
   * ```javascript
   *  ['key1', 'key2.nestedKey', 'key3']
   * ```
   */
  key: string | string[]
  query: string
  sort?: string
  page?: number
  limit?: number
}

export const searchInCollection = async <T extends keyof Config['collections']>(
  collection: T,
  { key, query, sort = 'id', page = 1, limit = 10 }: SearchInCollectionOptions,
  { searchParams = {} }: { searchParams?: Record<string, string | string[]> } = {},
) => {
  const keysPath = Array.isArray(key)
    ? key.map((key, index) => `[or][${index}][${key}][contains]=${encodeURI(query)}`).join('&')
    : `[${key}]`

  const url = `${CMS_URL}/api/${collection}?${getCmsSearchParams(
    searchParams,
  )}&where${keysPath}[contains]=${encodeURI(query)}&sort=${sort}&limit=${limit}&page=${page}`

  const response = await fetch(url)

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ SEARCH [${response.status}]:`, url)
  }

  return (await response.json()) as {
    docs: Config['collections'][T][]
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}

export const getProductsCountByFilters = async (
  params: Record<string, string | string[] | Record<string, string | string[]>>,
) => {
  const url = `${CMS_URL}/api/products-count-by-filters`

  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(params),
    next: { tags: ['productsCount'] },
  })

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ PAGINATED [${response.status}]:`, url)
  }

  const data = await response.json()

  return data as {
    totalProducts: number
    filters: {
      tags: { doc: Tag; count: number }[]
      trademarks: { doc: Trademark; count: number }[]
      countries: { doc: Country; count: number }[]
      specials: { doc: Special; count: number }[]
      price: {
        min?: number
        max?: number
      }
    }
  }
}

export const getProductsCountBySubcategories = async (
  params: Record<string, string | string[] | Record<string, string | string[]>>,
) => {
  const url = `${CMS_URL}/api/products-count-by-subcategories`

  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(params),
    next: { tags: ['productsCount'] },
  })

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ PAGINATED [${response.status}]:`, url)
  }

  const data = await response.json()

  return data as {
    totalProducts: number
    subcategories: { doc: Subcategory; count: number }[]
  }
}

export const getFilteredProducts = async (
  params: Record<string, string | string[] | Record<string, string | string[]>>,
) => {
  const url = `${CMS_URL}/api/filtered-products`

  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(params),
    next: { tags: ['filteredProducts'] },
  })

  if (process.env['NODE_ENV'] === 'production') {
    console.log(`CMS REQ PAGINATED [${response.status}]:`, url)
  }

  const data = await response.json()

  return data as {
    docs: Product[]
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}
