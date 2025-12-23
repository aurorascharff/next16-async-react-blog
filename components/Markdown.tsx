import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Light theme - minimal, monochromatic
const themeLight = {
  'code[class*="language-"]': {
    color: '#24292e',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  'pre[class*="language-"]': {
    color: '#24292e',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: '#24292e' },
  property: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  constant: { color: '#005cc5' },
  symbol: { color: '#005cc5' },
  selector: { color: '#6f42c1' },
  'attr-name': { color: '#6f42c1' },
  string: { color: '#032f62' },
  char: { color: '#032f62' },
  builtin: { color: '#005cc5' },
  operator: { color: '#d73a49' },
  entity: { color: '#6f42c1' },
  url: { color: '#032f62' },
  variable: { color: '#e36209' },
  atrule: { color: '#005cc5' },
  'attr-value': { color: '#032f62' },
  function: { color: '#6f42c1' },
  'class-name': { color: '#6f42c1' },
  keyword: { color: '#d73a49' },
  regex: { color: '#032f62' },
  important: { color: '#d73a49', fontWeight: 'bold' },
};

// Dark theme - minimal, monochromatic
const themeDark = {
  'code[class*="language-"]': {
    color: '#e1e4e8',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  'pre[class*="language-"]': {
    color: '#e1e4e8',
    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: '#e1e4e8' },
  property: { color: '#79b8ff' },
  tag: { color: '#85e89d' },
  boolean: { color: '#79b8ff' },
  number: { color: '#79b8ff' },
  constant: { color: '#79b8ff' },
  symbol: { color: '#79b8ff' },
  selector: { color: '#b392f0' },
  'attr-name': { color: '#b392f0' },
  string: { color: '#9ecbff' },
  char: { color: '#9ecbff' },
  builtin: { color: '#79b8ff' },
  operator: { color: '#f97583' },
  entity: { color: '#b392f0' },
  url: { color: '#9ecbff' },
  variable: { color: '#ffab70' },
  atrule: { color: '#79b8ff' },
  'attr-value': { color: '#9ecbff' },
  function: { color: '#b392f0' },
  'class-name': { color: '#b392f0' },
  keyword: { color: '#f97583' },
  regex: { color: '#9ecbff' },
  important: { color: '#f97583', fontWeight: 'bold' },
};

type Props = {
  children: string;
};

export function MarkdownContent({ children }: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Markdown
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
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
              <div className="not-prose my-4 overflow-hidden rounded-lg border border-border">
                <SyntaxHighlighter
                  style={themeLight}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-muted/50 !p-4 dark:hidden"
                >
                  {codeString}
                </SyntaxHighlighter>
                <SyntaxHighlighter
                  style={themeDark}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-muted/50 !p-4 hidden dark:block"
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

