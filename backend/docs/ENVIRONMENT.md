# Environment Variables Guide

All config is read in `src/config/env.ts`, which validates required keys at boot and fails fast if a critical one is missing. Copy `.env.example` → `.env` and fill in.

| Variable | Required | Default | Description |
|---|:--:|---|---|
| `NODE_ENV` | no | `development` | `development` \| `production`. Toggles HSTS, log level, cookie security. |
| `PORT` | no | `5000` | HTTP port. |
| `API_PREFIX` | no | `/api/v1` | Base path for the versioned API. |
| `CLIENT_URL` | yes | `http://localhost:3000` | Comma-separated allowlist for CORS **and** the CSRF Origin check. |
| `MONGODB_URI` | **yes** | — | Mongo connection string. |
| `JWT_ACCESS_SECRET` | **yes** | — | Signs 15-min access tokens. Use ≥32 random bytes. |
| `JWT_REFRESH_SECRET` | **yes** | — | Signs 7-day refresh tokens. Must differ from access secret. |
| `JWT_RESET_SECRET` | **yes** | — | Signs single-use password-reset tokens. |
| `JWT_ACCESS_EXPIRES_IN` | no | `15m` | Access token TTL. |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | Refresh token TTL. |
| `JWT_RESET_EXPIRES_IN` | no | `15m` | Reset token TTL. |
| `BCRYPT_SALT_ROUNDS` | no | `12` | Higher = slower = safer. 12 is a sane default. |
| `COOKIE_DOMAIN` | no | `localhost` | Cookie domain for the refresh cookie. |
| `COOKIE_SECURE` | no | `false` | `true` in production (HTTPS) → `Secure` + `SameSite=None`. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | for uploads | — | Résumé & logo storage. Uploads degrade if unset. |
| `CLOUDINARY_FOLDER` | no | `internbridge` | Asset folder prefix. |
| `GEMINI_API_KEY` | for AI | — | If unset, AI features fall back to deterministic output. |
| `GEMINI_MODEL` | no | `gemini-1.5-flash` | Model id. |
| `SMTP_HOST` / `_PORT` / `_SECURE` / `_USER` / `_PASS` | for email | — | If unset, emails are logged instead of sent (dev-friendly). |
| `EMAIL_FROM` | no | `InternBridge <no-reply@…>` | From header. |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Global rate-limit window (15 min). |
| `RATE_LIMIT_MAX` | no | `200` | Max requests/window/IP (global). |
| `AUTH_RATE_LIMIT_MAX` | no | `20` | Stricter cap for auth routes. |
| `LOG_LEVEL` | no | `info` | Winston level in production. |

## Secret generation

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generate a **distinct** value for each `*_SECRET`. In production, inject secrets via a secrets manager (AWS/GCP Secrets Manager, Doppler, Vault) — do not ship `.env` files.
