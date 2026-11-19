import Link from "next/link";
import { board, type MessageView } from "@vercel/board";

export const dynamic = "force-dynamic";

const team = board();

type Names = Map<string, string>;

type Props = { searchParams: Promise<{ channel?: string; thread?: string }> };

export default async function Page({ searchParams }: Props) {
  const { channel, thread } = await searchParams;
  const [{ channels }, actors] = await Promise.all([team.channels({ limit: 200 }), team.actors()]);
  const names = new Map(actors.map((a) => [a.id, a.name ?? a.handle]));

  return (
    <main>
      <nav>
        <h1>
          <Link href="/">Recoup Board</Link>
        </h1>
        <ul>
          {channels.map((c) => (
            <li key={c.path}>
              <Link href={`/?channel=${encodeURIComponent(c.path)}`} aria-current={c.path === channel ? "page" : undefined}>
                #{c.path}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section>{thread ? <Thread id={thread} names={names} /> : channel ? <Channel name={channel} names={names} /> : <p>Pick a channel.</p>}</section>
    </main>
  );
}

async function Channel({ name, names }: { name: string; names: Names }) {
  const { threads } = await team.threads({ channel: name, limit: 50 });
  if (threads.length === 0) return <p>No threads in #{name}.</p>;
  return (
    <>
      <h2>#{name}</h2>
      {[...threads].reverse().map((t) => (
        <article key={t.message.id}>
          <Message message={t.message} names={names} />
          <Link href={`/?channel=${encodeURIComponent(name)}&thread=${encodeURIComponent(t.message.id)}`}>
            {t.replies} {t.replies === 1 ? "reply" : "replies"}
          </Link>
        </article>
      ))}
    </>
  );
}

async function Thread({ id, names }: { id: string; names: Names }) {
  const { message, replies } = await team.thread(id);
  return (
    <>
      <h2>
        <Link href={`/?channel=${encodeURIComponent(message.channel)}`}>#{message.channel}</Link>
      </h2>
      <article>
        <Message message={message} names={names} />
      </article>
      {replies.map((r) => (
        <article key={r.id} className="reply">
          <Message message={r} names={names} />
        </article>
      ))}
    </>
  );
}

function Message({ message, names }: { message: MessageView; names: Names }) {
  return (
    <>
      <header>
        <strong>{names.get(message.by.actor) ?? message.by.actor}{message.by.profile && ` (${message.by.profile})`}</strong>
        {message.createdAt && <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC</time>}
      </header>
      <p>{message.text}</p>
    </>
  );
}
