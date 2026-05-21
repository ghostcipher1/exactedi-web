import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveDocLink } from "@/lib/dev-docs/resolveDocLink";
import { slugifyHeading } from "@/lib/dev-docs/headings";

interface DevDocsMarkdownProps {
  content: string;
}

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map((child) => headingText(child)).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: React.ReactNode } }).props;
    return headingText(props?.children ?? "");
  }
  return String(children ?? "");
}

export default function DevDocsMarkdown({ content }: DevDocsMarkdownProps) {
  return (
    <article className="prose prose-sm md:prose-base max-w-none prose-headings:text-stedi-dark-text prose-p:text-stedi-gray-text prose-strong:text-stedi-dark-text prose-a:text-stedi-green prose-a:no-underline hover:prose-a:underline prose-li:text-stedi-gray-text prose-ul:my-4 prose-ol:my-4 prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-0 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-28 prose-h3:text-base md:prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-28 prose-h4:text-sm prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2 prose-table:border prose-table:border-stedi-gray-border prose-th:bg-stedi-gray-light prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-medium prose-th:text-stedi-dark-text prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-stedi-gray-text prose-code:text-stedi-dark-text prose-code:bg-stedi-gray prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const resolved = resolveDocLink(href);
            if (resolved?.startsWith("/")) {
              const [path, hash] = resolved.split("#");
              return (
                <Link
                  to={hash ? { pathname: path, hash: `#${hash}` } : path}
                  className="text-stedi-green hover:underline"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={resolved}
                className="text-stedi-green hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          h2: ({ children }) => {
            const id = slugifyHeading(headingText(children));
            return (
              <h2 id={id} className="scroll-mt-28">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugifyHeading(headingText(children));
            return (
              <h3 id={id} className="scroll-mt-28">
                {children}
              </h3>
            );
          },
          pre: ({ children }) => (
            <pre className="rounded-lg border border-stedi-gray-border bg-stedi-dark p-4 overflow-x-auto not-prose">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code
                  className={`${className} text-xs md:text-sm text-gray-300 font-mono block whitespace-pre`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-stedi-gray text-stedi-dark-text text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
