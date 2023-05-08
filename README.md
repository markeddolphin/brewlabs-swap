# Brewlabs Earn

[![Netlify Status](https://api.netlify.com/api/v1/badges/85ccd8dc-e3bf-4bf4-86f5-6aebc43c9009/deploy-status)](https://app.netlify.com/sites/candid-taiyaki-130f86/deploys)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Node and NPM version

Install Volta - https://volta.sh/

It recommend to install and use [Volta](https://volta.sh/) with all Brewlabs projects. This ensures we are all using the same NPM and Node versions. When Volta is installed the correct version of NPM and Node is automatically changed when working within the codebase. The versions are configured in the `package.json`

## Getting Started

When pulling down for the first time or when new features have been merged you may need to install the node modules again.

```bash
npm i
```

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Tools, libraries and patterns

### Styling/CSS

##### https://tailwindcss.com/

Tailwind is used to write utility based CSS.

##### https://daisyui.com/

We use Daisy UI to extend Tailwind and make use of components quickly

##### https://wagmi.sh/

wagmi is a collection of React Hooks containing everything you need to start working with Ethereum.

### State Management

For managing global state please use React Hooks Global State module.

This should be sufficient for out needs.

##### https://www.npmjs.com/package/react-hooks-global-state

To maintain global state we use React Hooks Global State package.
See https://github.com/brewlabs-code/brewlabs-earn/blob/main/state/index.ts

## GIT processes

We use [GIT Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) as a branching model. Please name branches using the following prefixes:

- bug
- feature
- hot (hot-fix)

## Deployment

[Deploys using Netlify](https://app.netlify.com/sites/candid-taiyaki-130f86/overview)

This repo is configured to auto deploy from Netlify. Once out of development we will have tighter rules around deployment to production and how to push to a staging environment that can be used to QA work.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
