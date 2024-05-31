type SearchParamsType = {
  [key: string]: string | string[] | null
}

export const getSearchWith = (currentParams: URLSearchParams, paramsToUpdate: SearchParamsType) => {
  const newParams = new URLSearchParams(currentParams.toString())

  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key)
    } else if (Array.isArray(value)) {
      newParams.delete(key)

      value.forEach(part => {
        newParams.append(key, part.trim())
      })
    } else {
      newParams.set(key, value.trim())
    }
  })

  return newParams.toString()
}
