import { App, type Item, type Recipe } from '@hackclub/bag'
import { trim } from './utils'

const bagClient = async () =>
  await App.connect({
    appId: Number(import.meta.env.BAG_APP_ID),
    key: import.meta.env.BAG_APP_KEY
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
const invalidItems = [
  'gp',
  'Dinoisseur Challenge Coin',
  'Sockmeister Challenge Coin',
  'Wheat Seeds',
  'Grass Seeds',
  'Coconut',
  'Wheat Seeds',
  'Grass Seeds',
  'Fish Hat',
  'Fish',
  '1982 Wurlitzer Jukebox',
  'MASH Season 1',
  'MASH Season 2',
  'MASH Season 3',
  'MASH Season 4',
  'MASH Season 5',
  'MASH Season 6',
  'MASH Season 7',
  'MASH Season 8',
  'MASH Season 9',
  'MASH Season 10',
  'MASH Season 11',
  'MASH The Good Seasons',
  'MASH The Complete Series',
  'AfterMASH Season 1',
  'AfterMASH Season 2',
  'AfterMASH The Complete Series',
  'MASH The Movie',
  'MASH The Original Novel',
  'MASH The Ultimate Collection',
  'Bonsai',
  "Kamina's Shades",
  'Blahaj',
  'Cotton',
  'Hairball',
  'Cat Hat',
  'Acorn',
  'Rice',
  'Crab',
  'Clam',
  'Cheese'
]
export const items =
  globalThis.items ??
  (await bag.getItems({ query: JSON.stringify({}) })).filter(item => {
    if (invalidItems.includes(item.name)) return false
    return true
  })
export const recipes = globalThis.recipes ?? (await getRecipes())
export const canBeCrafted =
  globalThis.canBeCrafted ?? (await filter(recipes as Recipe[], items))
