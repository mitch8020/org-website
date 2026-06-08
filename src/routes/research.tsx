import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.research

export const Route = createFileRoute('/research')({
  head: () => ({
    meta: [
      { title: 'Research - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: ResearchRoute,
})

function ResearchRoute() {
  return <ReferencePage page={page} />
}
