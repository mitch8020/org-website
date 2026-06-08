import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.legal

export const Route = createFileRoute('/legal')({
  head: () => ({
    meta: [
      { title: 'Legal - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: LegalRoute,
})

function LegalRoute() {
  return <ReferencePage page={page} />
}
