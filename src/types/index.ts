export type NextRoute = {
  params: Record<string, string>
  searchParams: Record<string, string | string[]>
}

export type NextLayout = {
  params: Record<string, string>
  children: React.ReactNode
}
