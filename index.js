const leaf = require('./src/leaf.js')
const node = require('./src/node.js')
const seq = require('./src/seq.js')

const getGraph = schema => {
  const self = {}

  const { types } = schema
  const queries = []

  const fetchTypeSchema = name =>
    types.filter(typeSchema => typeSchema.name === name)[0]
  self.fetchTypeSchema = fetchTypeSchema

  const objToQuery = (o) => {
    const keys = Object.keys(o)
    if (keys.length === 0) return ''
    return `{ ${keys
      .map(key => `${key} ${objToQuery(o[key])}`)
      .join(' ')}} `
  }

  const buildQueryFromPaths = queryParts => {
    const out = {}
    queryParts.forEach(sections => {
      let tip = out
      let nextTip

      sections.forEach((section, i) => {
        if (section === '$') return

        const target = tip[section]

        if (target) {
          nextTip = target
          tip = nextTip
          return
        }
        nextTip = {}
        tip[section] = nextTip
        tip = nextTip
      })
    })
    return objToQuery(out)
  }

  const getQuery = () => buildQueryFromPaths(queries).trim()
  self.getQuery = getQuery

  const tree = (schema, path = []) => {
    const { kind } = schema
    queries.push(path)

    if (kind === 'OBJECT') return node(self, schema.name, path)

    if (kind === 'SCALAR') return leaf(path)

    if (kind === 'LIST') { return seq(tree(schema.ofType, path.concat('$')), path) }

    throw new Error('could not create node for kind ', kind)
  }
  self.tree = tree

  const graph = tree(schema.types[0])
  self.graph = graph

  return self
}

module.exports = getGraph
