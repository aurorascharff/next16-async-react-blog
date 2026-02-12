import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

// Light theme - minimal, monochromatic
const themeLight = {
  atrule: { color: '#005cc5' },
  'attr-name': { color: '#6f42c1' },
  'attr-value': { color: '#032f62' },
  boolean: { color: '#005cc5' },
  builtin: { color: '#005cc5' },
  cdata: { color: '#6a737d' },
  char: { color: '#032f62' },
  'class-name': { color: '#6f42c1' },
  'code[class*="language-"]': {
    color: '#24292e',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  constant: { color: '#005cc5' },
  doctype: { color: '#6a737d' },
  entity: { color: '#6f42c1' },
  function: { color: '#6f42c1' },
  important: { color: '#d73a49', fontWeight: 'bold' },
  keyword: { color: '#d73a49' },
  number: { color: '#005cc5' },
  operator: { color: '#d73a49' },
  'pre[class*="language-"]': {
    color: '#24292e',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  prolog: { color: '#6a737d' },
  property: { color: '#005cc5' },
  punctuation: { color: '#24292e' },
  regex: { color: '#032f62' },
  selector: { color: '#6f42c1' },
  string: { color: '#032f62' },
  symbol: { color: '#005cc5' },
  tag: { color: '#22863a' },
  url: { color: '#032f62' },
  variable: { color: '#e36209' },
};

// Dark theme - minimal, monochromatic
const themeDark = {
  atrule: { color: '#79b8ff' },
  'attr-name': { color: '#b392f0' },
  'attr-value': { color: '#9ecbff' },
  boolean: { color: '#79b8ff' },
  builtin: { color: '#79b8ff' },
  cdata: { color: '#6a737d' },
  char: { color: '#9ecbff' },
  'class-name': { color: '#b392f0' },
  'code[class*="language-"]': {
    color: '#e1e4e8',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  constant: { color: '#79b8ff' },
  doctype: { color: '#6a737d' },
  entity: { color: '#b392f0' },
  function: { color: '#b392f0' },
  important: { color: '#f97583', fontWeight: 'bold' },
  keyword: { color: '#f97583' },
  number: { color: '#79b8ff' },
  operator: { color: '#f97583' },
  'pre[class*="language-"]': {
    color: '#e1e4e8',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  prolog: { color: '#6a737d' },
  property: { color: '#79b8ff' },
  punctuation: { color: '#e1e4e8' },
  regex: { color: '#9ecbff' },
  selector: { color: '#b392f0' },
  string: { color: '#9ecbff' },
  symbol: { color: '#79b8ff' },
  tag: { color: '#85e89d' },
  url: { color: '#9ecbff' },
  variable: { color: '#ffab70' },
};

type Props = {
  children: string;
};

export function MarkdownContent({ children }: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="not-prose border-border my-4 overflow-hidden rounded-lg border">
                <SyntaxHighlighter
                  style={themeLight}
                  language={match[1]}
                  PreTag="div"
                  className="bg-muted/50! m-0! overflow-x-auto! p-4! dark:hidden"
                >
                  {codeString}
                </SyntaxHighlighter>
                <SyntaxHighlighter
                  style={themeDark}
                  language={match[1]}
                  PreTag="div"
                  className="bg-muted/50! m-0! hidden overflow-x-auto! p-4! dark:block"
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">{children}</table>
              </div>
            );
          },
          td({ children }) {
            return <td className="border-border/50 border-b px-4 py-3">{children}</td>;
          },
          th({ children }) {
            return <th className="px-4 py-3 font-semibold">{children}</th>;
          },
          thead({ children }) {
            return <thead className="bg-muted/50 border-border border-b font-medium">{children}</thead>;
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
