import { inspector } from "@vercel/board/inspect";
import { team } from "@/lib/board";
import { withBoardAuth } from "@/lib/auth/withBoardAuth";

// The board's viewer, for Recoup admins only: it reads and posts as this deployment.
const inspect = withBoardAuth(inspector({ board: team, basePath: "/board" }));

export const GET = inspect;
export const POST = inspect;
export const PATCH = inspect;
export const PUT = inspect;
export const DELETE = inspect;
