import { defineConfig } from 'astro/config';
import auth from 'auth-astro';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [auth()],
  output: "server",
  adapter: vercel()
});