import Markdown from 'react-markdown';

type Props = {
  children: string;
};

export function MarkdownContent({ children }: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Markdown>{children}</Markdown>
    </div>
  );
}

