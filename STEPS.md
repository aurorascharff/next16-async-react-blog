# DEMO STEPS

## Setup and starting point

- The app is a static blog site, but it also has this dynamic dashboard for content management. This is a common pattern for a lot of websites, where you have a public facing side that is more static and optimized for performance and SEO, and then you have a dashboard or admin panel that is more dynamic and optimized for interactivity and user experience.
- The setup is the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS. Using React Server Components as my data fetching framework. I also use Next.js Cache Components here for the optimal data fetching and caching experience, to easily create this static dynamic hybrid app.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see this is the bad UX we had from the beginning in the slides. Let's fix it by designing the appropriate in-between states.

## Async Data Loading

- Let's work on our data loading. We can see the initial loading state is a Spinner, streaming RSCs. Let's convert it to a proper skeleton state. Here, see if your designer would like to create some reusable skeleton UI, or if your design system or component library already have some skeleton components, you can use those.
- In Next.js, we have the loading.tsx file that allows us to define a loading state for our page. This is similar in other frameworks like Tanstack Router. However, here, we want to show more of the UI instead of hiding the whole page. Delete it.
- Are you familiar with cache components? They will actually tell us if we are blocking our application from loading. Notice the error, we need to add back a suspense boundary here. But we want to add it further down the tree, so we can show more of the UI.
- Use Suspense in the dashboard page.tsx. Skeletons give users a sense of the content structure and make loading feel faster. Use a skeleton component that mimics the structure of the content. Wrap the PostList RSC.
- Now, we can see the shell of the page immediately, and then the post list will load in with a nice skeleton.
- Increasing our perceived performance with a better FCP and LCP.
- Now, we have a much better loading state, while revealing the UI faster. With CacheComponents, the shell will be statically rendered. I get a way better FCP and LCP here. And it will be prefetched for instant navigations.
- Let's do the same for the blog page. We are already using Suspense here, but we have some CLS. All we need to do is just adjust these skeletons to match the content. Suspense lets us declaratively define loading states right next to our content.
- Let's use the new React Devtools Suspense panel to pin these and easier design them for us. Switch screen to localhost suspense. Now, we could code this realtime and make sure there is no CLS and the shape of the skeleton matches the content. Update to proper skeleton for the header, showcase, then do the same for the content. Refresh the page and see how we have a stable layout and a much better loading experience.
- Also, let's fix the edit page. Switch from loading to Suspense with skeleton: cacheComp error, use Suspense.
- Already, our loading states feel way better.
- What about the error state? What if content throws? Throw. Our entire app breaks. Let's add an error.tsx file to handle errors in our blog page. This way, we can show a user-friendly error message instead of a blank page, and use layouts to preserve the surrounding UI.
- What about the post list error? Showcase the error states by throwing. App broke. We can use a local ErrorBoundary for post list to avoid hiding the top content if the post list fails to load, add a custom label and fullwidth, allow retry. Add snippet errorUI. Declarative approach, pairs with Suspense.
- Different frameworks like react router 7 or tanstack router have their own route-level error boundaries similar to this.
- Collaborate with the designer to create intentional error states that fit the app design.
- Do the same for the global app errors if there is an issue with the system.
- (Not found boundary: Let's add a not-found.tsx file to handle 404 errors in our app.)
- (Bonus: We can also add an unauthenticated state to our app. This way, if a user tries to access a page that requires authentication without being logged in, we can show them a message prompting them to log in instead of just redirecting them or showing a blank page. Unauthorized.tsx and throw from the server if the user is not authenticated.)
- Add animations our async data loading. Example of ViewTransition to the loading experience of the post list. This creates a smooth transition between the loading state and the loaded content. Add snippet suspensePostListWithAnimation.

## Async Navigations

- We also have navigations in this app that are delayed. Clicking the sort or the tabs use search params and refetch data from the server, an async routing navigation. Let's add some loading state to these as well.
- Let's try the tabs, notice it uses the router. What if this component could handle it's own async coordination? Switch to an action prop to declaratively solve this. We can utilize our design component action prop to get an optimistic pending state for the tab buttons. This way, when a user clicks on a tab, we can immediately show a loading state on the button itself, giving them instant feedback. It uses async react under the hood, abstracted away from us, showcase. It also has been pre-designed for us to fit our app design.
- SortButton: let's try the Async React primitives. A local spinner is suitable here, it's just a small and quick interaction.
- Here, we can implement the startTransition useOptimistic pattern ourselves again. Let's say this is a custom thing we are building. Now it will be interactive and responsive. Add snippet customAsyncReact.
- I might just add a small spinner next to the button, and then ask my designer if they agree, or if they have other ideas. They usually say "great, but maybe try this instead"! Usually they have some additional insight that I didn't think of.
- Again, ask your designer what kind of loading states they would like to see for these interactions.
- Design components can abstract away the complexities of async interactions and provide a consistent experience across the app. They can also be pre-designed to fit the app's design system, saving us time and ensuring a cohesive look and feel. As we see more of Async React primitives being adopted by design systems and component libraries, we can easily integrate these patterns into our apps without having to build them from scratch.
- Let's add animations to our async routing. Animate the list reordering when we sort the posts so users see the changes in real-time, using the ViewTransition API around the Card.
- Let's animate the page navigation to the blog post as well. This gives users a contextual transition that helps them understand the relationship between the list and the detail view. Add this reusable slider component wrapping the ViewTransition API. SlideRightTransition wrap list layout. Ask designer about preferred animations for navigations.
- (Add slideRightAnimation to the new post page as well.)

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
- Remember, the interactions themselves are not actually any faster.
- If you are interested in learning more about Async React and how to implement these patterns in your own apps, or about the features I'm using from Next.js here, check out the blog posts inside the demo app. They cover what we did in more detail and reference the code itself.
