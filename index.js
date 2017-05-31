const getGraph = schema => {
  const { types } = schema

  const fetchTypeSchema = name =>
    types.filter(typeSchema => typeSchema.name === name)[0]
  const queries = []

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

  const graph = (schema, path = [], getterPath = []) => {
    const { kind } = schema
    queries.push(path)

    if (kind === 'OBJECT') return node(schema, path, getterPath)

    if (kind === 'SCALAR') return leaf(schema, path, getterPath)

    if (kind === 'LIST') return seq(schema, path, getterPath)

    throw new Error('could not create node for kind ', kind)
  }

  const node = (schema, path, getterPath) => {
    const self = {}

    fetchTypeSchema(schema.name).fields.forEach(field => {
      const { name, type } = field
      Object.defineProperty(
        self,
        name,
        {
          get: () => graph(type, path.concat(name), getterPath.concat(name)),
          enumerable: true
        }
      )
    })

    const resolve = data => getIn(getterPath, data)
    self.$resolve = resolve

    return self
  }

  const getIn = ([key, ...path], o) => {
    const next = o[key]
    if (next === undefined || typeof next !== 'object') return next

    if (path.length === 0) return next

    return getIn(path, next)
  }

  const leaf = (schema, path, getterPath) => {
    const transforms = []
    const self = {}

    const applyTransform = (result, transform) => transform(result)
    const resolve = data =>
      transforms.reduce(applyTransform, getIn(getterPath, data))
    self.$resolve = resolve

    const ap = f => { transforms.push(f); return self }
    self.$ap = ap

    return self
  }

  const seq = (schema, path, getterPath) => {
    let mapped = graph(schema.ofType, path, getterPath)
    const self = {}

    const map = f => { mapped = f(mapped); return self }
    self.$map = map

    const resolve = data => getIn(getterPath, data)
      .map(data => mapped.$resolve(data))
    self.$resolve = resolve

    return self
  }

  return {
    graph: graph(schema.types[0]),
    getQuery: () => buildQueryFromPaths(queries).trim()
  }
}

module.exports = getGraph
