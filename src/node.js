const node = (graph, name, path) => {
  const self = {}

  const isNode = true
  self.isNode = isNode

  graph.fetchTypeSchema(name).fields.forEach(field => {
    const { name, type } = field
    Object.defineProperty(
      self,
      name,
      {
        get: () => graph.tree(type, path.concat(name)),
        enumerable: true
      }
    )
  })

  const resolve = () => { throw new Error('cannot resolve a node') }
  self.$resolve = resolve

  const ap = () => { throw new Error('cannot ap a node') }
  self.$ap = ap

  return self
}

module.exports = node
