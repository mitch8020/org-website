import { createFileRoute } from '@tanstack/react-router'
import { WebsiteWorkbench } from '#/components/admin/website-workbench/WebsiteWorkbench'
import { MemberGate } from '#/components/shop/MemberGate'
import { ShopShell } from '#/components/shop/ShopShell'

export const Route = createFileRoute('/admin/website')({
  head: () => ({
    meta: [
      { title: 'Website archive — ORG' },
      {
        name: 'description',
        content: 'Draft and publish ORG website records.',
      },
    ],
  }),
  component: AdminWebsitePage,
})

function AdminWebsitePage() {
  return (
    <ShopShell>
      <main className="relative z-[1] mx-auto max-w-[1480px] px-[clamp(16px,3vw,40px)] pb-24 pt-[clamp(132px,16vh,176px)]">
        <MemberGate returnTo="/admin/website">
          <WebsiteWorkbench />
        </MemberGate>
      </main>
    </ShopShell>
  )
}
