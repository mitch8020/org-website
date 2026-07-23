# Auth0 onboarding for ORG

The application-side integration is complete. The Auth0 tenant must contain one
Single Page Application and one API whose values match the environment files.

## 1. Create the API

1. In Auth0, create an API named `ORG Backend`.
2. Use an identifier such as `https://api.the-org.example`.
3. Keep the signing algorithm set to `RS256`.
4. Enable RBAC and enable adding permissions to access tokens.
5. Add permissions named `read:orders` and `update:orders`.

The API identifier is used as `AUTH0_AUDIENCE` in `org-backend` and
`VITE_AUTH0_AUDIENCE` in `org-website`.

## 2. Create the website application

1. Create a Single Page Application named `ORG Website`.
2. Add `http://localhost:3000` to Allowed Callback URLs.
3. Add `http://localhost:3000` to Allowed Logout URLs.
4. Add `http://localhost:3000` to Allowed Web Origins.
5. Add the production website URL to all three fields before deployment.

Copy the Auth0 domain and client ID into the website environment variables.
The domain must also be used as the backend issuer URL, including `https://`
and a trailing slash.

## 3. Create the admin role

1. Create a role named `ORG Shop Admin`.
2. Assign the `read:orders` and `update:orders` API permissions.
3. Assign the role only to members who should see shipping records or update
   fulfillment status.

## 4. Configure both repositories

Copy each `.env.example` to `.env` and supply the real values. Never commit
`.env`, Auth0 secrets, the MongoDB URI, or the Resend API key.

The SPA uses Authorization Code with PKCE through `@auth0/auth0-react`. The
backend accepts only RS256 access tokens with the configured issuer and
audience; it does not accept ID tokens as API credentials.
