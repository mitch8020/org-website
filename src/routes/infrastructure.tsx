import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { REFERENCE_PAGE_BY_ID } from '#/lib/reference-pages'

const page = REFERENCE_PAGE_BY_ID.infrastructure

export const Route = createFileRoute('/infrastructure')({
  head: () => ({
    meta: [
      { title: 'Infrastructure - ORG' },
      { name: 'description', content: page.subtitle },
    ],
  }),
  component: InfrastructureRoute,
})

function InfrastructureRoute() {
  return <ReferencePage page={page} />
}
