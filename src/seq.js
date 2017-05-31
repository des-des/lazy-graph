const { extractData } = require('./helpers.js')

const wrapDescriptor = (desciptor, name, wrapFunction) => {
  const { get, value } = desciptor

  if (name === '$resolve') return {}

  if (typeof get === 'function') return { get: wrapFunction(get) }

  if (typeof value === 'function') return { value: wrapFunction(value) }

  return {}
}

const wrapInnerProp = (inner, path, propName) => {
  const desciptor = Object.getOwnPropertyDescriptor(inner, propName)

  const wrapFunction = f => (...args) => seq(f(...args), path)

  const wrapped = wrapDescriptor(desciptor, propName, wrapFunction)

  return Object.assign({}, desciptor, wrapped)
}

const resolveInner = (inner, data, indexes) => (_, i) =>
  inner.$resolve(data, indexes.concat(i))

const seq = (inner, path) => {
  const self = {}

  const isSeq = true
  self.isSeq = isSeq

  Object.keys(inner).forEach(propName => {
    Object.defineProperty(
      self,
      propName,
      wrapInnerProp(inner, path, propName)
    )
  })

  const resolve = (data, indexes = []) => {
    const seqData = extractData(path, data, indexes)
    return seqData.map(resolveInner(inner, data, indexes))
  }
  self.$resolve = resolve

  return self
}

module.exports = seq
