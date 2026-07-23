import type { WebsitePageContent } from '#/lib/content-types'
import { AboutContentEditor } from './content-editor/AboutContentEditor'
import { ReferenceContentEditor } from './content-editor/ReferenceContentEditor'

export function WebsiteContentForm({
  content,
  onChange,
}: {
  content: WebsitePageContent
  onChange: (content: WebsitePageContent) => void
}) {
  return content.kind === 'reference' ? (
    <ReferenceContentEditor content={content} onChange={onChange} />
  ) : (
    <AboutContentEditor content={content} onChange={onChange} />
  )
}
