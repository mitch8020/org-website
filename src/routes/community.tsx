import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.community

export const Route = createFileRoute('/community')({
  head: () => ({
    meta: [
      { title: 'Community - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: CommunityRoute,
})

function CommunityRoute() {
  return <ReferencePage page={page} />
}
