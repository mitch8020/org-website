import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/research')({
  loader: () => loadPublishedPage('research'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Research'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: ResearchRoute,
})

function ResearchRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
