import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/community')({
  loader: () => loadPublishedPage('community'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Community'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: CommunityRoute,
})

function CommunityRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
