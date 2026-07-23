import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.donations

export const Route = createFileRoute('/gifts-contributions')({
  head: () => ({
    meta: [
      { title: 'Offerings - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: GiftsContributionsRoute,
})

function GiftsContributionsRoute() {
  return <ReferencePage page={page} />
}
