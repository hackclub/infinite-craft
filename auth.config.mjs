import Slack from '@auth/core/providers/slack'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  providers: [
    Slack({
      clientId: import.meta.env.SLACK_CLIENT_ID,
      clientSecret: import.meta.env.SLACK_CLIENT_SECRET,
      checks: ['pkce', 'nonce'],
      redirectProxyUrl:
        import.meta.env.NODE_ENV === 'development'
          ? import.meta.env.AUTH_REDIRECT
          : undefined
    })
  ],
  secret: import.meta.env.AUTH_SECRET,
  trustHost: true
})
