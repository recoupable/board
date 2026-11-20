import { getAdminStatus } from "@/lib/auth/getAdminStatus";
import { getBoardAccessToken } from "@/lib/auth/getBoardAccessToken";

type Handler = (request: Request) => Promise<Response> | Response;

const isBoardPage = (request: Request) =>
  request.method === "GET" && ["/board", "/board/"].includes(new URL(request.url).pathname);

const signIn = (request: Request) => {
  const url = new URL(request.url);
  const target = new URL("/sign-in", url);
  target.searchParams.set("next", url.pathname);
  return Response.redirect(target, 307);
};

/**
 * Lets only Recoup admins through to the board. Visitors sign in with
 * Privy; their access token is checked against the Recoup API, as Music
 * Nerd's API checks its admins. A signed-out visitor to the page is sent to
 * sign in; other requests get 401, a non-admin 403, and a failed check 503.
 *
 * @param handler - The board's own handler.
 * @returns The handler behind the check.
 */
export function withBoardAuth(handler: Handler): (request: Request) => Promise<Response> {
  return async request => {
    const token = getBoardAccessToken(request);
    if (!token) {
      return isBoardPage(request)
        ? signIn(request)
        : Response.json({ error: "Not signed in" }, { status: 401 });
    }

    let status;
    try {
      status = await getAdminStatus(token);
    } catch {
      return Response.json({ error: "Could not check your access" }, { status: 503 });
    }

    if (status === "unauthenticated") {
      return isBoardPage(request)
        ? signIn(request)
        : Response.json({ error: "Not signed in" }, { status: 401 });
    }
    if (status === "not_admin") {
      return new Response("This board is for Recoup admins. Sign in with another account at /sign-in.", {
        status: 403,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return handler(request);
  };
}
