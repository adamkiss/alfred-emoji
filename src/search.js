'use strict'

const emojilib = require('emojilib')
const emojiNames = emojilib.ordered

let verb = 'Copy'
let preposition = 'to clipboard'

const resetWordsForPasteByDefault = () => {
  verb = 'Paste'
  preposition = 'as snippet'
}

const alfredItem = (emoji, name, keywords) => {
  return {
    uid: name,
    title: `${name} (${keywords.join(', ')})`,
    subtitle: `${verb} "${emoji}" (${name}) ${preposition}`,
    arg: emoji,
    autocomplete: name,
    icon: { path: `./icons/${name}.png` },
    mods: {
      alt: {
        subtitle: `${verb} ":${name}:" (${emoji}) ${preposition}`,
        arg: `:${name}:`
      }
    }
  }
}

const alfredItems = (names) => {
  const items = []
  names.forEach((name) => {
    const emoji = emojilib.lib[name].char
    if (!emoji) return
    items.push(alfredItem(emoji, name, emojilib.lib[name].keywords))
  })
  return { items }
}

const all = () => alfredItems(emojiNames)

const matches = (terms) => {
  return emojiNames.filter((name) => {
    return terms.every((term) => {
      return name.includes(term) ||
        emojilib.lib[name].keywords.some((keyword) => keyword.includes(term))
    })
  })
}

// :thumbs up: => ['thumbs', 'up']
const parse = query => query.replace(/[:]/g, '').split(/\s+/)

module.exports = function search (query, pasteByDefault = false) {
  if (pasteByDefault) resetWordsForPasteByDefault()

  if (!query) return all()

  const terms = parse(query)

  return alfredItems(matches(terms))
}
