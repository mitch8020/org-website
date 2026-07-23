import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/gifts-contributions')({
  loader: () => loadPublishedPage('donations'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Offerings'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: GiftsContributionsRoute,
})

function GiftsContributionsRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
