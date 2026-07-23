import { apiRequest } from './api'
import {
  DEFAULT_WEBSITE_PAGES,
  getDefaultWebsiteContent,
} from './content-defaults'
import type {
  AboutPageContent,
  AdminWebsitePage,
  PublishedWebsitePage,
  ReferencePageContent,
  WebsitePageContent,
  WebsitePageId,
} from './content-types'

type ContentFor<T extends WebsitePageId> = T extends 'about'
  ? AboutPageContent
  : ReferencePageContent

type PublishedFor<T extends WebsitePageId> = Omit<
  PublishedWebsitePage,
  'pageId' | 'content'
> & {
  pageId: T
  content: ContentFor<T>
}

function defaultPublished<T extends WebsitePageId>(pageId: T): PublishedFor<T> {
  return {
    pageId,
    revision: 1,
    content: getDefaultWebsiteContent(pageId) as ContentFor<T>,
    publishedAt: new Date(0).toISOString(),
  }
}

export async function loadPublishedPage<T extends WebsitePageId>(
  pageId: T,
): Promise<PublishedFor<T>> {
  try {
    return await apiRequest<PublishedFor<T>>(`/content/pages/${pageId}`)
  } catch {
    return defaultPublished(pageId)
  }
}

export async function loadPublishedPages(): Promise<PublishedWebsitePage[]> {
  try {
    const pages = await apiRequest<PublishedWebsitePage[]>('/content/pages')
    const byId = new Map(pages.map((page) => [page.pageId, page]))
    return Object.keys(DEFAULT_WEBSITE_PAGES).map(
      (pageId) =>
        byId.get(pageId as WebsitePageId) ??
        defaultPublished(pageId as WebsitePageId),
    )
  } catch {
    return Object.keys(DEFAULT_WEBSITE_PAGES).map((pageId) =>
      defaultPublished(pageId as WebsitePageId),
    )
  }
}

export async function loadAdminPage(
  pageId: WebsitePageId,
  token: string,
): Promise<AdminWebsitePage> {
  return apiRequest<AdminWebsitePage>(`/admin/content/pages/${pageId}`, {
    token,
  })
}

export async function saveAdminDraft(
  pageId: WebsitePageId,
  token: string,
  expectedDraftRevision: number | null,
  content: WebsitePageContent,
): Promise<AdminWebsitePage> {
  return apiRequest<AdminWebsitePage>(`/admin/content/pages/${pageId}/draft`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ expectedDraftRevision, content }),
  })
}

export async function publishAdminDraft(
  pageId: WebsitePageId,
  token: string,
  expectedDraftRevision: number,
): Promise<AdminWebsitePage> {
  return apiRequest<AdminWebsitePage>(
    `/admin/content/pages/${pageId}/publish`,
    {
      method: 'POST',
      token,
      body: JSON.stringify({ expectedDraftRevision }),
    },
  )
}

export async function discardAdminDraft(
  pageId: WebsitePageId,
  token: string,
  expectedDraftRevision: number,
): Promise<AdminWebsitePage> {
  return apiRequest<AdminWebsitePage>(
    `/admin/content/pages/${pageId}/discard-draft`,
    {
      method: 'POST',
      token,
      body: JSON.stringify({ expectedDraftRevision }),
    },
  )
}

export async function restoreAdminRevision(
  pageId: WebsitePageId,
  revision: number,
  token: string,
  expectedDraftRevision: number | null,
): Promise<AdminWebsitePage> {
  return apiRequest<AdminWebsitePage>(
    `/admin/content/pages/${pageId}/revisions/${revision}/restore`,
    {
      method: 'POST',
      token,
      body: JSON.stringify({ expectedDraftRevision }),
    },
  )
}
