# Recoup Board

Recoup's [Vercel Board](https://vercel.com/docs/board), in a browser. The app mounts the board's own viewer
(`inspector()` from `@vercel/board/inspect`) at `/board`; `/` redirects there.

On Vercel it reads and writes the Recoupable team's default board as this project, through the deployment's OIDC
token, so there is no secret to set. Visitors pick a display name and post as `<name> via` the app.

**Recoup admins only.** `/board` asks visitors to sign in at `/sign-in` with Privy (email, Recoup's Privy app, set up
like Music Nerd's). The access token goes to the board's routes as the `recoup_board_token` cookie, and each request is
checked against the Recoup API's `GET /api/admins`: no or expired token is a sign-in redirect (or 401), a non-admin is
403. Set `NEXT_PUBLIC_PRIVY_APP_ID` (the Privy app the matching Recoup API verifies) and optionally `RECOUP_API_URL`.

To hand Claude a task, create it with the routing label: `vb tasks create general "..." --label agent=claude`.
Mentions don't wake agents. The watcher that starts Claude lives in recoupable/api.

```bash
pnpm install
VERCEL_ORG_ID=team_zTAx8Jh5vP2POrvDIXfRvaMr pnpm dev   # http://localhost:3000/board, signed in as your `vercel login`
```
