import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const minimalLight = {
  'code[class*="language-"]': {
    color: '#393a34',
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    color: '#393a34',
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  comment: { color: '#999988', fontStyle: 'italic' },
  string: { color: '#e3116c' },
  'attr-value': { color: '#e3116c' },
  punctuation: { color: '#393a34' },
  operator: { color: '#393a34' },
  keyword: { color: '#00a4db' },
  function: { color: '#9a050f' },
  'function-variable': { color: '#9a050f' },
  'class-name': { color: '#9a050f' },
  tag: { color: '#00009f' },
  'attr-name': { color: '#00a4db' },
  boolean: { color: '#00a4db' },
  number: { color: '#00a4db' },
  builtin: { color: '#9a050f' },
};

const minimalDark = {
  'code[class*="language-"]': {
    color: '#d4d4d4',
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    color: '#d4d4d4',
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  string: { color: '#9ecbff' },
  'attr-value': { color: '#9ecbff' },
  punctuation: { color: '#d4d4d4' },
  operator: { color: '#d4d4d4' },
  keyword: { color: '#f97583' },
  function: { color: '#b392f0' },
  'function-variable': { color: '#b392f0' },
  'class-name': { color: '#b392f0' },
  tag: { color: '#85e89d' },
  'attr-name': { color: '#b392f0' },
  boolean: { color: '#79b8ff' },
  number: { color: '#79b8ff' },
  builtin: { color: '#b392f0' },
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
                  style={minimalLight}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-muted/50 !p-4 dark:hidden"
                >
                  {codeString}
                </SyntaxHighlighter>
                <SyntaxHighlighter
                  style={minimalDark}
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

