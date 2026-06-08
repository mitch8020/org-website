import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.future

export const Route = createFileRoute('/future-ideas')({
  head: () => ({
    meta: [
      { title: 'Future Ideas - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: FutureIdeasRoute,
})

function FutureIdeasRoute() {
  return <ReferencePage page={page} />
}
