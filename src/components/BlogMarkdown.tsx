import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface BlogMarkdownProps {
  content: string;
}

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <article className="prose prose-lg max-w-none prose-headings:text-stedi-dark-text prose-p:text-stedi-gray-text prose-strong:text-stedi-dark-text prose-a:text-stedi-green prose-a:no-underline hover:prose-a:underline prose-li:text-stedi-gray-text prose-ul:my-4 prose-ol:my-4 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg md:prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-table:border prose-table:border-stedi-gray-border prose-th:bg-stedi-gray-light prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-medium prose-th:text-stedi-dark-text prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-stedi-gray-text">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link to={href} className="text-stedi-green hover:underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                className="text-stedi-green hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
