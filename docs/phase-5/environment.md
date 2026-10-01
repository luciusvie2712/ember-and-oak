# Environment and Configuration

Environments are `local`, `development`, `staging`, and `production`. Local values begin in `.env.example` and each app's `.env.example`; staging variable names are shown in `.env.staging.example`. Copy examples locally—never edit examples with real credentials.

The API loads and validates configuration through Zod before listening. `DATABASE_URL` is mandatory; invalid or missing required values stop startup. `DATABASE_CHECK_ON_STARTUP=true` additionally proves connectivity before accepting traffic. Frontend values are public only when deliberately named `NEXT_PUBLIC_*`; secrets, session keys, email keys, analytics write keys, and error-tracking credentials remain server/platform variables.

Configuration categories reserved now are database, asset/CDN, email, analytics, error tracking, and log level. Production values are not inferred from visual/product placeholders.
