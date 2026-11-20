# Environment Variables

All client-exposed variables **must** be prefixed `NEXT_PUBLIC_` — anything else
is stripped from the browser bundle. Do **not** put secrets (API keys, JWT
secrets) in this app; they belong in the backend only.

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:5000/api/v1` | Base URL of the backend API, **including** the `/api/v1` prefix. Used by the Axios client and the `/api/health` probe. |
| `NEXT_PUBLIC_APP_NAME` | ➖ | `CareerSync` | Display name used in titles/branding. |

## Per-environment values

| Environment | `NEXT_PUBLIC_API_URL` |
|---|---|
| Local | `http://localhost:5000/api/v1` |
| Staging | `https://api-staging.internbridge.app/api/v1` |
| Production | `https://api.internbridge.app/api/v1` |

## Notes

- The refresh-token cookie is set by the **backend**. For cross-site cookies in
  production the backend must send `SameSite=None; Secure` and CORS must allow
  the web origin with `credentials: true`. Keep the web and API on the same
  parent domain (e.g. `app.` and `api.`) to simplify cookie scope.
- Because `NEXT_PUBLIC_*` values are inlined at **build time**, a value change
  requires a rebuild (or use runtime config / a `/config` endpoint if you need
  to vary it per-deploy without rebuilding).
