import { bag, items } from '../lib/bag'
import { getSession } from 'auth-astro/server'
import { WebClient } from '@slack/web-api'

const web = new WebClient(import.meta.env.SLACK_BOT_TOKEN)

export async function POST({ params, request }) {
  const data = await request.json()
  if (!data.outputs) return new Response()

  const session = await getSession(request)

  if (!session)
    return new Response(
      JSON.stringify({
        loggedIn: false
      })
    )

  let app = await bag.getApp()
  const { user } = session
  const slack = (
    await web.users.lookupByEmail({
      email: user.email
    })
  ).user.id

  const discovered = data.outputs.map(output => output.recipeItemId)
  const prev = app.metadata[slack] ?? []

  app = await bag.updateApp({
    new: {
      metadata: JSON.stringify({
        [slack]: [...prev, ...discovered]
      })
    }
  })

  // Check if user had made all items
  if (new Set(app.metadata[slack]).size === items.length) {
    // Give them the badge!
    await bag.createInstance({
      identityId: slack,
      itemId: 'Infinite Craft Badge',
      quantity: 1,
      note: "Looks like you've discovered all the recipes in Infinite Craft... you're worthy of this badge."
    })
    return new Response(
      JSON.stringify({
        discovered: true
      })
    )
  }

  return new Response(
    JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build'
    })
  )
}
