import { board } from "@vercel/board";

/** The Recoupable team's default board. On Vercel it acts as this project, through the deployment's OIDC token. */
export const team = board();
