# DEMO STEPS

## Setup and starting point

- This is a blog app with this dashboard section to manage content.
- The setup is the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS. I also use Next.js Cache Components here for the optimal data fetching and caching experience.
- Demo app: You can see this is the bad UX we had from the beginning in the slides. Let's fix it by designing the appropriate in-between states.

## Async Data & Loading

- Let's work on our data loading. We can see the initial loading state is a Spinner. Let's convert it to a proper skeleton state. Here, see if your designer would like to create some reusable skeleton UI, or if your design system or component library already have some skeleton components, you can use those.
- In Next.js, we have the loading.tsx file that allows us to define a loading state for our page. This is similar in other frameworks like Tanstack Router. However, here, we want to show more of the UI instead of hiding the whole page. Delete it.
- CacheComponents telling me I need a loading state here, so let's switch to React Suspense. CacheComponents is a new feature in Next.js 16, and it will error if you don't unblock your data fetching.
- Use Suspense in the dashboard page.tsx. Skeletons give users a sense of the content structure and make loading feel faster. Use a skeleton component that mimics the structure of the content.
- Now, we have a much better loading state, while revealing the UI faster. With CacheComponents, the shell will be statically rendered. I get a way better FCP and LCP here. And it will be prefetched for instant navs.
- Let's do the same for the blog page. We are already using Suspense here, but we have some CLS. All we need to do is just adjust these skeletons to match the content. Suspense lets us declaratively define loading states right next to our content.
- Let's use the new React Devtools Suspense panel to pin these and easier design them for us. Switch screen to localhost suspense. Now, we could code this realtime and make sure there is no CLS and the shape of the skeleton matches the content. Update to proper skeleton for the header, showcase, then do the same for the content. Refresh the page and see how we have a stable layout and a much better loading experience.
- Also, let's fix the edit page. Switch from loading to Suspense with skeleton: cacheComp error, use Suspense.
- Already, our loading states feel way better.
- What about the error state? What if it throws? Throw. Our entire app breaks. Let's add an error.tsx file to handle errors in our blog page. This way, we can show a user-friendly error message instead of a blank page, and use layouts to preserve the surrounding UI.
- What about the post list error? Showcase the error states by throwing. App broke. We can use a local ErrorBoundary for post list to avoid hiding the top content if the post list fails to load, add a custom label and fullwidth, allow retry. Add snippet errorUI.
- Different frameworks like react router 7 or tanstack router have their own route-level error boundaries similar to this.
- Collaborate with the designer to create intentional error states that fit the app design.
- Do the same for the global app errors if there is an issue with the system.
- (Not found boundary: Let's add a not-found.tsx file to handle 404 errors in our app.)
- (Bonus: We can also add an unauthenticated state to our app. This way, if a user tries to access a page that requires authentication without being logged in, we can show them a message prompting them to log in instead of just redirecting them or showing a blank page. Unauthorized.tsx and throw from the server if the user is not authenticated.)
- Add animations our async data loading. Example of ViewTransition to the loading experience of the post list. This creates a smooth transition between the loading state and the loaded content. Add snippet suspensePostListWithAnimation.

## Async Navigation

- We also have navigations in this app that are delayed. Clicking the sort or the tabs use search params and refetch data from the server, an async routing navigation. Let's add some loading state to these as well.
- Let's try the tabs, notice it uses the router. What if this component could handle it's own async coordination? Switch to an action prop to declaratively solve this.We can utilize our design component action prop to get an optimistic pending state for the tab buttons. This way, when a user clicks on a tab, we can immediately show a loading state on the button itself, giving them instant feedback. It uses async react under the hood, abstracted away from us, showcase.
- SortButton: let's try the Async React primitives. A local spinner is suitable here, it's just a small and quick interaction. Here, we can implement the startTransition useOptimistic pattern ourselves again. Let's say this is a custom thing we are building. Now it will be interactive and responsive. Add snippet customAsyncReact.
- Again, ask your designer what kind of loading states they would like to see for these interactions.
- Let's add animations to our async routing. Animate the list reordering when we sort the posts so users see the changes in real-time, using the ViewTransition API around the Card.
- Let's animate the page navigation to the blog post as well. This gives users a contextual transition that helps them understand the relationship between the list and the detail view. Add this reusable slider component wrapping the ViewTransition API. SlideLeftTransition wrap list page. Ask designer about preferred animations for navigations.

## Async Mutations

- Now, let's work on our mutations. When we click the Archive button here, we have no feedback at all. Form actions are already using transitions, we don't need to wrap transitions. We can add useOptimistic UI to immediately update the UI when we click the button, then we can check the optimistic similarity to show a glimmer on the card with CSS has().
- When we click a couple archives and then we switch tabs, the entire interaction is synced automatically with Async React, avoiding any weird states. Async React primitives handle all the complexities of async interactions for us.
- And what about error state? We should probably toast here to let them know if something went wrong with the archiving. Let's stop them from archiving seed posts with a toast. Ask your designer what these toasts should look like to fit the app design, and what the text should be per error.

## Review

- Let me get rid of all my changes and show you the difference before and after again.
- Before, we had long paints and janky layouts, global spinners and frozen user interactions, and no error boundaries.
- Here is the after, I deployed this one. I also added some other improvements. We have faster paints and a stable layout, skeletons and local feedback, and robust error states. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift dramatically. Meeting Web Vitals targets directly translates to a smoother feel and also better SEO and discoverability.
- If you are interested in learning more about Async React and how to implement these patterns in your own apps, or about the features I'm using from Next.js here, check out the blog posts inside the demo app. They cover what we did in more detail and reference the code itself.
