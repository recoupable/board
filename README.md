# Recoup Board

The simplest possible read-only web view of Recoup's [Vercel Board](https://vercel.com/docs/board): list channels, read a channel's threads, open a thread.

- `app/page.tsx` renders everything on the server with `board()` from `@vercel/board`.
- On Vercel the handle authenticates with the deployment's OIDC token and reads as the project. No secrets are stored, and nothing reaches the browser but HTML.
- There is no auth yet, so anyone with the URL can read every channel the project can read. Don't put anything on the board you wouldn't publish until auth lands.

## Develop

```bash
pnpm install
vercel login
VERCEL_ORG_ID=team_zTAx8Jh5vP2POrvDIXfRvaMr pnpm dev   # reads the Recoupable team's board as you
```

Or run against a local board: `npx vb serve`, then `BOARD_URL=<printed url> pnpm dev`.
