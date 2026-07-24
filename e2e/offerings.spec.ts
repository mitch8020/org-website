import { expect, test } from '@playwright/test'

const emptyCart = {
  id: 'cart-1',
  items: [],
  suggestedItemsCents: 0,
  suggestedShippingCents: 0,
  suggestedTotalCents: 0,
}

test('filters the catalog and records an offering in the guest docket', async ({
  page,
}) => {
  const product = {
    _id: 'product-1',
    slug: 'mesh-tool',
    name: 'Mesh Tool',
    category: 'laboratory-tools',
    summary: 'A practical mesh tool.',
    description: 'Built for careful laboratory work.',
    specifications: ['Stainless mesh', 'Reusable'],
    imageUrl:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
    imageAlt: 'Mesh tool',
    availability: 'active',
    variants: [
      {
        id: 'standard',
        label: 'Standard',
        suggestedDonationCents: 1200,
        options: {},
      },
    ],
  }
  const recordedCart = {
    ...emptyCart,
    items: [
      {
        itemId: 'line-1',
        productSlug: product.slug,
        productName: product.name,
        imageUrl: product.imageUrl,
        imageAlt: product.imageAlt,
        variantId: 'standard',
        variantLabel: 'Standard',
        quantity: 2,
        note: 'Blue',
        unitSuggestedDonationCents: 1200,
        lineSuggestedDonationCents: 2400,
      },
    ],
    suggestedItemsCents: 2400,
    suggestedShippingCents: 1500,
    suggestedTotalCents: 3900,
  }

  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    if (path.endsWith('/products')) {
      await route.fulfill({ json: [product] })
    } else if (path.endsWith('/donation-config')) {
      await route.fulfill({
        json: {
          currency: 'USD',
          suggestedShippingCents: 1500,
          paypalUrl: 'https://example.test/paypal',
          venmoUrl: 'https://example.test/venmo',
          paypalHandle: '@org',
          venmoHandle: '@org',
          verification: 'manual',
        },
      })
    } else if (path.endsWith('/carts/guest')) {
      await route.fulfill({
        json: { guestToken: 'guest-token', cart: emptyCart },
      })
    } else if (path.endsWith('/cart/items')) {
      await route.fulfill({ json: recordedCart })
    } else if (path.endsWith('/cart')) {
      await route.fulfill({ json: emptyCart })
    } else {
      await route.fulfill({ status: 404, json: { message: 'Not mocked.' } })
    }
  })

  await page.goto('/offerings')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Tools for the work.' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Laboratory tools', exact: true })
    .click()
  await page.getByRole('button', { name: /Mesh Tool/ }).click()

  await expect(
    page.getByRole('heading', { level: 2, name: 'Mesh Tool' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Increase quantity' }).click()
  await page.getByPlaceholder(/Color, dimensions, device/).fill('Blue')
  await page.getByRole('button', { name: 'Add to order' }).click()

  const docket = page.getByRole('complementary', { name: 'Offering docket' })
  await expect(docket).toBeVisible()
  await expect(docket.getByText('2 × Standard')).toBeVisible()
  await expect(docket.getByText('$39.00')).toBeVisible()
})
