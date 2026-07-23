import { createFileRoute } from '@tanstack/react-router'
import { AboutDocument } from '#/components/about/AboutDocument'
import { loadPublishedPage } from '#/lib/content-api'

export const Route = createFileRoute('/about')({
  loader: () => loadPublishedPage('about'),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.content.title ?? 'About Us'} — ORG · The Octagon Religious-Research Group`,
      },
      {
        name: 'description',
        content:
          'The founding document of ORG — the Octagon Religious-Research Group and Spirituality Centers: identity, mission, governance, and contact.',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return <AboutDocument content={Route.useLoaderData().content} />
}
