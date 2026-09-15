# Repository guidance

- Use the Node.js and pnpm versions pinned in `mise.toml`.
- Run `pnpm check` before handoff. Also run `pnpm build` after dependency,
  configuration, routing, or styling changes.
- Use Biome for formatting and linting; keep editor settings aligned with
  `biome.json`.
- Keep external-service tests deterministic. Mock DynamoDB and Upstash instead
  of requiring credentials or production access.

## Application invariants

- `POST /api/v1/shorten` validates URLs and delegates deduplication and creation
  to `src/lib/service/shorten.ts`.
- Short IDs contain nine characters. Existing URLs return their stored record
  rather than creating another item.
- DynamoDB uses `id` as its primary key and `long-url-index` on `longUrl`.
- `GET /[id]` redirects resolved records and sends missing records to `/404`.
- Environment variable names and local placeholders live in `.env.example`;
  keep secrets in ignored `.env*.local` files.
