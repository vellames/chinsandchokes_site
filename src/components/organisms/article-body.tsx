import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a({ href, children }) {
    const external = href !== undefined && /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
        {children}
      </a>
    );
  },
  img({ src, alt, title }) {
    if (typeof src !== "string") return null;
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element -- body images come from any host typed in the DB */}
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
        {title && <figcaption>{title}</figcaption>}
      </figure>
    );
  },
  // Markdown "# Title" would compete with the page headline.
  h1: ({ children }) => <h2>{children}</h2>,
  // An image paragraph would put <figure> inside <p>.
  p({ node, children }) {
    const onlyImage = node?.children.length === 1 && node.children[0]?.type === "element" && node.children[0].tagName === "img";
    return onlyImage ? <>{children}</> : <p>{children}</p>;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
};

/** Article body from Markdown (GFM). Raw HTML in the source is ignored (react-markdown default). */
export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose-cc">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
