import { For, type JSX } from "solid-js";

/**
 * Tiny markdown-ish renderer for docs content:
 * headings, fences, tables, lists, bold, code, links, paragraphs.
 */
export default function DocMarkdown(props: { source: string }): JSX.Element {
  const blocks = () => parseBlocks(props.source);

  return (
    <div class="doc-prose space-y-4 text-[15px] leading-7 text-zinc-300">
      <For each={blocks()}>
        {(b) => {
          if (b.type === "h2")
            return (
              <h2 class="mt-10 scroll-mt-28 text-xl font-bold tracking-tight text-white first:mt-0">
                {b.text}
              </h2>
            );
          if (b.type === "h3")
            return (
              <h3 class="mt-6 scroll-mt-28 text-lg font-semibold text-zinc-100">
                {b.text}
              </h3>
            );
          if (b.type === "code")
            return (
              <pre class="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0c14] p-4 text-[12px] leading-5 text-indigo-100">
                <code>{b.text}</code>
              </pre>
            );
          if (b.type === "table")
            return (
              <div class="overflow-x-auto rounded-xl border border-white/10">
                <table class="w-full min-w-[480px] text-left text-[13px]">
                  <thead class="bg-white/[0.04] text-zinc-400">
                    <tr>
                      <For each={b.header}>
                        {(h) => (
                          <th class="px-3 py-2 font-semibold border-b border-white/10">
                            <Inline text={h} />
                          </th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={b.rows}>
                      {(row) => (
                        <tr class="border-b border-white/5 last:border-0">
                          <For each={row}>
                            {(cell) => (
                              <td class="px-3 py-2 align-top text-zinc-300">
                                <Inline text={cell} />
                              </td>
                            )}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            );
          if (b.type === "ul")
            return (
              <ul class="list-disc space-y-1 pl-5 marker:text-indigo-400">
                <For each={b.items}>
                  {(item) => (
                    <li>
                      <Inline text={item} />
                    </li>
                  )}
                </For>
              </ul>
            );
          if (b.type === "ol")
            return (
              <ol class="list-decimal space-y-1 pl-5 marker:text-indigo-400">
                <For each={b.items}>
                  {(item) => (
                    <li>
                      <Inline text={item} />
                    </li>
                  )}
                </For>
              </ol>
            );
          if (b.type === "p")
            return (
              <p class="text-zinc-300">
                <Inline text={b.text} />
              </p>
            );
          return null;
        }}
      </For>
    </div>
  );
}

function Inline(props: { text: string }): JSX.Element {
  // links [text](url), bold **x**, code `x`
  const parts: JSX.Element[] = [];
  const re =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const s = props.text;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong class="font-semibold text-zinc-100">{tok.slice(2, -2)}</strong>,
      );
    } else if (tok.startsWith("`")) {
      parts.push(
        <code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-indigo-200">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[")) {
      const mm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (mm) {
        parts.push(
          <a
            href={mm[2]}
            class="text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 hover:text-indigo-200"
            target={mm[2]!.startsWith("http") ? "_blank" : undefined}
            rel={mm[2]!.startsWith("http") ? "noreferrer" : undefined}
          >
            {mm[1]}
          </a>,
        );
      } else parts.push(tok);
    }
    last = m.index + tok.length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return <>{parts}</>;
}

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "code"; text: string; lang?: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] };

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const buf: string[] = [];
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        buf.push(lines[i] ?? "");
        i++;
      }
      i++; // closing fence
      out.push({ type: "code", text: buf.join("\n"), lang });
      continue;
    }
    if (line.startsWith("|") && lines[i + 1]?.match(/^\|[\s\-:|]+$/)) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("|")) {
        rows.push(splitRow(lines[i] ?? ""));
        i++;
      }
      out.push({ type: "table", header, rows });
      continue;
    }
    if (line.startsWith("## ")) {
      out.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      out.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^[-*] /, ""));
        i++;
      }
      out.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\d+\. /, ""));
        i++;
      }
      out.push({ type: "ol", items });
      continue;
    }
    // paragraph (merge consecutive non-empty non-special)
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,3} |```|\||[-*] |\d+\. )/.test(lines[i] ?? "")
    ) {
      buf.push(lines[i] ?? "");
      i++;
    }
    out.push({ type: "p", text: buf.join(" ") });
  }
  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}
