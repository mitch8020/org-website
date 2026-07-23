# Auth0 onboarding for ORG

The application-side integration is complete. The Auth0 tenant must contain one
Single Page Application and one API whose values match the environment files.

## 1. Create the API

1. In Auth0, create an API named `ORG Backend`.
2. Use an identifier such as `https://api.the-org.example`.
3. Keep the signing algorithm set to `RS256`.
4. Enable RBAC and enable adding permissions to access tokens.
5. Add permissions named `read:orders`, `update:orders`, `read:content`,
   `update:content`, and `publish:content`.
6. Under **Application Access Policy**, set **User-Delegated Access** to
   **Per-app authorization**.
7. Under **Application Access**, grant the `ORG Website` application
   user-delegated access to all five permissions.

The API identifier is used as `AUTH0_AUDIENCE` in `org-backend` and
`VITE_AUTH0_AUDIENCE` in `org-website`.

## 2. Create the website application

1. Create a Single Page Application named `ORG Website`.
2. Add `http://localhost:50073/callback` to Allowed Callback URLs.
3. Add `http://localhost:50073/logout` to Allowed Logout URLs.
4. Add `http://localhost:50073` to Allowed Web Origins.
5. Before deployment, use the production `/callback` URL for callbacks, the
   production `/logout` URL for logouts, and the bare production origin for Web
   Origins.

Copy the Auth0 domain and client ID into the website environment variables.
The domain must also be used as the backend issuer URL, including `https://`
and a trailing slash.

## 3. Create the admin roles

1. Create a role named `ORG Shop Admin`.
2. Assign the `read:orders` and `update:orders` API permissions.
3. Assign the role only to members who should see shipping records or update
   fulfillment status.
4. Create a separate role named `ORG Website Admin`.
5. Assign the `read:content`, `update:content`, and `publish:content`
   permissions.
6. Assign the role only to members who should draft and publish the eight
   managed website records.

Roles take effect in newly issued access tokens. After assigning or removing an
admin role, have that member sign out and sign in again before testing access.

## 4. Configure both repositories

Copy each `.env.example` to `.env` and supply the real values. Never commit
`.env`, Auth0 secrets, the MongoDB URI, or the Resend API key.

The SPA uses Authorization Code with PKCE through `@auth0/auth0-react`. The
backend accepts only RS256 access tokens with the configured issuer and
audience; it does not accept ID tokens as API credentials.
