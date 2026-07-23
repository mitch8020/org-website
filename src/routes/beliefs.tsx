import { createFileRoute } from '@tanstack/react-router'
import { ReferencePage } from '#/components/ReferencePage'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/beliefs')({
  loader: () => loadPublishedPage('beliefs'),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content.title ?? 'Beliefs'} - ORG` },
      { name: 'description', content: loaderData?.content.subtitle },
    ],
  }),
  component: BeliefsRoute,
})

function BeliefsRoute() {
  return <ReferencePage page={Route.useLoaderData().content} />
}
