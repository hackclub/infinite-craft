import { App, type Item, type Recipe } from '@hackclub/bag'
import { trim } from './utils'

const bagClient = async () =>
  await App.connect({
    appId: Number(import.meta.env.BAG_APP_ID),
    key: import.meta.env.BAG_APP_KEY,
    baseUrl: 'http://0.0.0.0:3000'
  })

const filter = async (recipes: Recipe[], items: Item[]): Promise<Item[]> => {
  // Filter for items that have recipes associated with them, since otherwise they're kind of useless
  let filtered = []
  for (let item of items) {
    if (
      recipes.find(recipe => {
        const possible = [...recipe.inputs, ...recipe.outputs, ...recipe.tools]
        if (possible.find(recipeItem => recipeItem.recipeItemId === item.name))
          return true
        return false
      })
    )
      filtered.push(item)
  }
  return filtered
}

const getRecipes = async () => {
  const recipes = await bag.getRecipes({})
  return recipes.map(recipe => ({
    ...recipe,
    outputs: recipe.outputs.map(output => {
      console.log(output)
      const slug = trim(output.recipeItem.reaction, ':')
      return {
        ...output,
        recipeItem: {
          ...output.recipeItem,
          metadata: JSON.stringify(output.recipeItem.metadata)
        },
        name: output.recipeItemId,
        image: `https://raw.githubusercontent.com/hackclub/bag-manifest/production/images/${slug}.png`
      }
    })
  }))
}

declare global {
  var bag: undefined | App
  var items: undefined | Item[]
  var recipes: undefined | Recipe[]
  var canBeCrafted: undefined | Item[]
}

export const bag = globalThis.bag ?? (await bagClient())
export const items =
  globalThis.items ?? (await bag.getItems({ query: JSON.stringify({}) }))
export const recipes = globalThis.recipes ?? (await getRecipes())
export const canBeCrafted =
  globalThis.canBeCrafted ?? (await filter(recipes, items))
