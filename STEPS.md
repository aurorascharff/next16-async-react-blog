# DEMO STEPS

## Setup and starting point

- Blog app with dashboard to manage content.
- Stack: Next.js App Router, Prisma ORM, Prisma Postgres DB, Tailwind CSS, Next.js Cache Components.
- Data fetching slowed down to simulate poor network. This is the bad UX from the slides—fix with proper in-between states.

## Async Data Loading

- Initial loading is a spinner. Convert to skeleton state. Use reusable skeleton UI from design system or component library.
- Delete loading.tsx—show more UI instead of hiding the whole page. Similar pattern in Tanstack Router.
- Cache components reveal blocking issues. Add Suspense boundary further down the tree to show more UI.
- Use Suspense in dashboard page.tsx with skeleton mimicking content structure—users see the shell immediately.
- Better FCP and LCP. Shell is statically rendered and prefetched for instant navigations.
- Blog page: adjust skeletons to match content and eliminate CLS.
- Use React Devtools Suspense panel to pin and design skeletons. Ensure no CLS and skeleton shape matches content.
- Edit page: switch from loading to Suspense with skeleton.
- Error states: throw → app breaks. Add error.tsx for user-friendly error message. Layouts preserve surrounding UI.
- Post list error: use local ErrorBoundary to avoid hiding top content. Add custom label, fullwidth, retry. Snippet: errorUI. Declarative approach pairs with Suspense.
- Other frameworks (React Router 7, Tanstack Router) have similar route-level error boundaries.
- Collaborate with designer on intentional error states.
- Handle global app errors as well.
- (Not found: add not-found.tsx for 404s.)
- (Bonus: unauthorized.tsx for auth errors—show login prompt instead of redirect/blank page.)
- Add ViewTransition to post list loading for smooth transitions. Snippet: suspensePostListWithAnimation.

## Async Router

- Sort/tabs use searchParams and refetch data—async routing navigation. Add loading states.
- Tabs: switch to action prop for optimistic pending state on buttons. Async React abstracted away, pre-designed to fit app.
- SortButton: use startTransition + useOptimistic pattern. Small spinner for quick interaction. Snippet: customAsyncReact.
- Consult designer on loading states—they often have additional insight.
- Design components abstract async complexity and provide consistent UX. As design systems adopt Async React primitives, integration becomes easier.
- Animate list reordering with ViewTransition API around Card.
- Animate page navigation to blog post with SlideRightTransition wrapper. Consult designer on navigation animations.
- (Add slideRightAnimation to new post page.)

## Async Mutations

- Now, let's work on our mutations. When we click the Archive button here, we have no feedback at all. Form actions are already using transitions, we don't need to wrap transitions. We can add useOptimistic UI to immediately update the UI when we click the button, then we can check the optimistic similarity to show a glimmer on the card with CSS has().
- When we click a couple archives and then we switch tabs, the entire interaction is synced automatically with Async React, avoiding any weird states. Async React primitives handle all the complexities of async interactions for us.
- And what about expected errors? We should probably toast here to let them know if something went wrong with the archiving. Let's stop them from archiving seed posts with a toast.
- Notice how useOptimistic automatically rolls back the UI if the mutation fails, so we don't have to do any manual error handling here. This makes our code much cleaner and easier to maintain. We can just add a toast on error to inform the user about what went wrong.
- Ask your designer what these toasts should look like to fit the app design, and what the text should be per error.

### (Async Mutations - Pessimistic)

- These are optimistic mutations, but we can also have pessimistic ones. For pessimistic mutations, we can show a loading state while the mutation is in progress, and then update the UI once it's complete. This is useful for actions that take longer to complete or have more significant consequences.
- Let's update the pessimistic mutation for creating a new post. When a user clicks the "New Post" button, we can show a loading state while the post is being created, and then navigate to the new post once it's ready.
- In our new.tsx page, the PostForm uses useActionState to handle the form submission. This hook has additional utilities on top of Async React, like form state management and queuing. We can utilize the pending state from useActionState to disable the submit button and show a spinner while the form is being submitted. However, the design of this button should be integrated into the design system, so we can just use the pending state to automatically get the appropriate styles and feedback for our app design. Let's switch to this self contained SubmitButton component that is already integrated with our design system.
- Let's also add some pending state to the delete button in the post page. Here, let's use another form utility, useFormStatus, inside this reusable SubmitButton component. All we need to do is switch it out here. It will get the state from the nearest parent form. This way, we can provide consistent feedback for all our forms across the app.

## Review

- Let me get rid of all my changes and show you the difference before and after again.
- Before, we had long paints and janky layouts, global spinners and frozen user interactions, and no error boundaries.
- Here is the after, I deployed this one. I also added some other improvements, like better animations. We have faster paints and a stable layout, skeletons and local feedback, and robust error states. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift dramatically. Meeting Web Vitals targets directly translates to a smoother feel and also better SEO and discoverability.
- If you are interested in learning more about Async React and how to implement these patterns in your own apps, or about the features I'm using from Next.js here, check out the blog posts inside the demo app. They cover what we did in more detail and reference the code itself.
