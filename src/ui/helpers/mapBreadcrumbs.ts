import { Page } from 'cms-types'

type Breadcrumb = {
  doc?: string | Page | null
  url?: string | null
  label?: string | null
  id?: string | null
}

type Replace = {
  labelReplace: {
    from: string
    to: string
  }
  urlReplace: {
    from: string
    to: string
  }
}

export const mapBreadcrumbs = (breadcrumbs?: Breadcrumb[] | null, replace?: Replace) => {
  const { labelReplace, urlReplace } = replace || {}

  const mappedBreadcrumbs = (breadcrumbs ?? []).map(({ id, label, url }) => {
    let mappedLabel = label!
    let mappedUrl = url!

    switch (true) {
      case mappedLabel.includes('{{category}}'):
        mappedLabel = mappedLabel.replace(labelReplace?.from ?? '', labelReplace?.to ?? '')
        mappedUrl = mappedUrl.replace(urlReplace?.from ?? '', urlReplace?.to ?? '')
        break

      default:
        break
    }

    return {
      id,
      url: mappedUrl,
      label: mappedLabel,
    }
  })

  return mappedBreadcrumbs
}
