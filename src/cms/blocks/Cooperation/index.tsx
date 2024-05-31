import { getCollectionItem } from '@/cms'
import { CooperationBlock } from 'cms-types'
import { CooperationClient } from './CooperationClient'

export async function Cooperation({ logos, title }: CooperationBlock) {
  const mappedLogos = await Promise.all(
    (logos ?? []).map(async ({ id, logo }) => {
      const mappedLogo = typeof logo === 'string' ? await getCollectionItem(logo, 'images') : logo

      return {
        id: id!,
        logo: mappedLogo,
      }
    }),
  )

  return <CooperationClient title={title ?? ''} logos={mappedLogos} />
}
