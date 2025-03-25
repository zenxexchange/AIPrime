<a href="https://ai-primeai.vercel.app/">
  <img alt="Next.js and App Router-ready AI chatbot." src="https://ai-primeAI.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js AI Chatbot</h1>
</a>

<p align="center">
  An open-source AI chatbot built with Next.js and Vercel AI SDK, supporting multiple AI models:
  OpenAI, Google Gemini, Google Vertex AI, Claude AI, Grok.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI, Google Gemini, Claude AI, Grok
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
  - Icons from [Phosphor Icons](https://phosphoricons.com)
- [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication
- [Vercel Postgres](https://vercel.com/storage/postgres) or [Neon Postgres](https://neon.tech) for database
- [tRPC](https://github.com/trpc/trpc) for End-to-end APIs

## Model Providers

- [ChatGPT](https://platform.openai.com/account/api-keys) for OpenAI and Azure OpenAI
- [Gemini Pro](https://makersuite.google.com/app/apikey) for Google and Google Vertex AI
- [Claude AI](https://console.anthropic.com/settings/keys) for Anthropic and Google Vertex AI
- [Grok](https://console.x.ai/) for xAI


## Creating a Vercel Postgres Instance

Follow the steps outlined in the [quick start guide](https://vercel.com/docs/storage/vercel-postgres/quickstart) provided by Vercel. This guide will assist you in creating and configuring your postgres database instance on Vercel, enabling your application to interact with it.

## Running locally

You will need to use the environment variables defined in [`.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

For local development, it's recommended to use [Supabase database](https://supabase.com) as your database. Add `?workaround=supabase-pooler.vercel` in your  `POSTGRES_URL`.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
