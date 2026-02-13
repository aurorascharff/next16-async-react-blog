# DEMO STEPS

## Setup and starting point

- This is a blog app with this dashboard section to manage content.
- The setup is the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS. I also use Next.js Cache Components here for the optimal data fetching and caching experience.
- Demo app: You can see this is the bad UX we had from the beginning in the slides. Let's fix it by designing the appropriate in-between states.

## Async Data & Loading

- Let's work on our data loading. We can see the initial loading state is a Spinner. Let's convert it to a proper skeleton state. Here, see if your designer would like to create some reusable skeleton UI, or if your design system or component library already have some skeleton components, you can use those. In this case, I have a simple skeleton component that mimics the structure of the content I'm loading.
- In Next.js, we have the loading.tsx file that allows us to define a loading state for our page. This is similar in other frameworks like Tanstack Router. However, here, we want to show more of the UI instead of hiding the whole page. Skeletons create a more predictable and visually appealing loading experience, as they give users a sense of the content structure and make the loading process feel faster.
- CacheComponents telling me I need a loading state here, so let's switch to React Suspense. CacheComponents is a new feature in Next.js 16, and it will error if you don't unblock your data fetching.
- Let's add a random skeleton. It doesn't look great... Let's use the new React Devtools Suspense panel to pin these and easier design them for us. Switch screen to localhost suspense.
- Now, we have a much better loading state that gives users a sense of the content structure and makes the loading experience more pleasant, while revealing the UI faster. With CacheComponents, this will be statically rendered. I get a way better FCP and LCP here. And it will be prefetched for instant navs.
- Let's do the same for the blog page. We are already using Suspense here, but we have some CLS. All we need to do is just adjust these skeletons to match the content. Suspense let's us declaratively define our loading states right next to our content, which makes it easier to maintain and update as our UI evolves.
- Also, let's fix the edit page. Switch from loading to Suspense with skeleton.
- Already, our loading states feel way better.
- What about the error state? Let's add an error.tsx file to handle errors in our blog page. This way, if something goes wrong during data fetching, we can show a user-friendly error message instead of a blank page or a generic error screen. This improves the overall user experience and helps users understand what went wrong. We can use a local ErrorBoundary for post list to avoid hiding the top content if the post list fails to load. Showcase the error states by throwing.
- Different frameworks like react router 7 or tanstack router have their own route-level error boundaries similar to this.
- Again, collaborate with the designer to create intentional error states that fit the overall design of the app and provide clear guidance to users on how to proceed when an error occurs.
- Do the same for the global app errors if there is an issue with the system.
- (Not found boundary: Let's add a not-found.tsx file to handle 404 errors in our app.)
- (Bonus: We can also add an unauthenticated state to our app. This way, if a user tries to access a page that requires authentication without being logged in, we can show them a message prompting them to log in instead of just redirecting them or showing a blank page. Unauthorized.tsx and throw from the server if the user is not authenticated.)
- Add example of ViewTransition to the loading experience. This will create a smooth transition between the loading state and the loaded content, making the experience feel more seamless and polished.

## Async Navigation

- We also have navigations in this app that are delayed. Clicking the sort or the tabs use search params and refetch data from the server, an async routing navigation. Let's add some loading state to these as well.
- Let's try the tabs. We can utilize our design component action prop to get an optimistic pending state for the tab buttons. This way, when a user clicks on a tab, we can immediately show a loading state on the button itself, giving them instant feedback. Switch to an action prop to declaratively solve this. It uses async react under the hood, abstracted away from us.
- SortButton: let's try the Async React primitives. A local spinner is suitable here, it's just a small and quick interaction. Here, we can implement the startTransition useOptimistic pattern ourselves again. Let's say this is a custom thing we are building. Now it will be interactive and responsive.
- Again, ask your designer what kind of loading states they would like to see for these interactions.
- Let's animate the tab navigation by adding a view transition here. This will create a smooth and visually appealing transition between the different tabs. Also, let's animate the list reordering when we sort the posts. This will let the users visually see the changes happening in real-time.
- Let's animate the page navigation to the blog post as well. This will give the users a contextual transition that helps them understand the relationship between the list and the detail view, making the navigation feel more intuitive and engaging. Add this reusable slider component wrapping the ViewTransition API. These can also be designed by your designer to fit the overall look and feel of the app.

## Async Mutations

- Now, let's work on our mutations. When we click the Archive button here, as you saw in the slides, we have no feedback at all. Let's add some loading state to this button. We can use the isPending state from the useTransition hook to show a glimmer on the card with CSS has(). Then, we can add useOptimistic UI to immediately update the UI when we click the button, without waiting for the server response. This way, we can provide instant, local feedback to the user and make the app feel more responsive. Form actions are already using transitions, we don't need to wrap it. Check equal state with server to see if it's pending.
- When we click a couple archives and then we switch tabs, the entire interaction is synced automatically with Async React, avoiding any weird states. This is the power of Async React primitives, they handle all the complexities of async interactions for us, allowing us to focus on creating a great user experience.
- And what about error state? We should probably toast here to let them know if something went wrong with the archiving. We can use a simple toast component to show error messages in a non-intrusive way, allowing users to understand what went wrong without disrupting their workflow. Let's stop them from archiving seed posts with a toast. Ask your designer for guidance on the messaging and design of these toasts to ensure they fit well with the overall look and feel of the app.

## Review

- Let me get rid of all my changes and show you the difference before and after again.
- Before, we had long paints and janky layouts, global spinners and frozen user interactions, and no error boundaries.
- Here is the after, I deployed this one. We have faster paints and a stable layout, skeletons and local feedback, and robust error and not‑found states. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift dramatically. Meeting Web Vitals targets directly translates to a smoother feel and also better SEO and discoverability.
