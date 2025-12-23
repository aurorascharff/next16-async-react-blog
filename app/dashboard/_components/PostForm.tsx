'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ActionResult } from '@/data/actions/post-actions';

type FormValues = {
  title: string;
  description: string;
  content: string;
  published: boolean;
};

type Props<T extends string> = {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues: FormValues;
  submitLabel: string;
  successMessage: string;
  redirectTo: Route<T>;
  cancelHref: Route<T>;
};

export function PostForm<T extends string>({ action, defaultValues, submitLabel, successMessage, redirectTo, cancelHref }: Props<T>) {
  const router = useRouter();

  const [state, formAction] = useActionState(async (_prevState: FormValues, formData: FormData) => {
    const result = await action(formData);
    if (result.success) {
      toast.success(successMessage);
      router.push(redirectTo);
      return _prevState;
    } else {
      toast.error(result.error);
      return result.formData ?? _prevState;
    }
  }, defaultValues);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={state.title}
          placeholder="Enter post title"
          required
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={state.description}
          placeholder="A brief summary for previews and SEO..."
          required
          rows={2}
          className="resize-none"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="content">Content</Label>
          <span className="text-muted-foreground text-xs">Markdown supported</span>
        </div>
        <Textarea
          id="content"
          name="content"
          defaultValue={state.content}
          placeholder="Write your post content using **markdown**..."
          required
          rows={12}
          className="resize-y font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={state.published}
          className="border-input size-4 rounded"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Published
        </Label>
      </div>
      <div className="flex gap-3 pt-2">
        <SubmitButton size="lg">{submitLabel}</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

