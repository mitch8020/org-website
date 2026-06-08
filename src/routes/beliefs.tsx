import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.beliefs

export const Route = createFileRoute('/beliefs')({
  head: () => ({
    meta: [
      { title: 'Beliefs - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: BeliefsRoute,
})

function BeliefsRoute() {
  return <ReferencePage page={page} />
}
