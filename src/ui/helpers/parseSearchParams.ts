export const parseSearchParams = (searchParams: Record<string, string | string[]>, key: string) => {
  return decodeURIComponent(
    Array.isArray(searchParams[key]) ? searchParams[key]?.[0] ?? '' : (searchParams[key] as string),
  )
}
