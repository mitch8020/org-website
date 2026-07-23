import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/future-ideas')({
  loader: () => loadPublishedPage('future'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Future Ideas'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: FutureIdeasRoute,
})

function FutureIdeasRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
