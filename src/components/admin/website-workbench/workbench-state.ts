import { cloneWebsiteContent } from '#/lib/content-defaults'
import type { AdminWebsitePage, WebsitePageContent } from '#/lib/content-types'

export interface WorkingPageState {
  working: WebsitePageContent
  savedSnapshot: string
}

export function createWorkingPageState(
  page: AdminWebsitePage,
): WorkingPageState {
  const source = page.draft?.content ?? page.published.content
  const working = cloneWebsiteContent(source)
  return {
    working,
    savedSnapshot: JSON.stringify(working),
  }
}

export function hasUnsavedWebsiteChanges(
  working: WebsitePageContent | null,
  savedSnapshot: string,
) {
  return !!working && JSON.stringify(working) !== savedSnapshot
}

export function getWorkbenchError(cause: unknown, fallback: string) {
  return cause instanceof Error ? cause.message : fallback
}
