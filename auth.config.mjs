import Slack from '@auth/core/providers/slack'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  providers: [
    Slack({
      clientId: import.meta.env.SLACK_CLIENT_ID,
      clientSecret: import.meta.env.SLACK_CLIENT_SECRET,
      checks: ['pkce', 'nonce'],
      redirectProxyUrl:
        'https://cb43-71-235-174-134.ngrok-free.app/api/auth/callback/slack'
    })
  ],
  secret: import.meta.env.AUTH_SECRET,
  trustHost: true
})
