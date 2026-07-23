import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/infrastructure')({
  loader: () => loadPublishedPage('infrastructure'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Infrastructure'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: InfrastructureRoute,
})

function InfrastructureRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
