import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/legal')({
  loader: () => loadPublishedPage('legal'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Legal'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: LegalRoute,
})

function LegalRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
