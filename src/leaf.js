const { extractData } = require('./helpers.js')

const applyTransform = (data, indexes) => (result, fn) => {
  const next = fn(result)
  return next.isLeaf ? next.$resolve(data, indexes) : next
}

const applyTransforms = (data, leafData, indexes, fns) =>
  fns.reduce(applyTransform(data, indexes), leafData)

const leaf = (path, transforms = []) => {
  const self = {}

  const isLeaf = true
  self.isLeaf = isLeaf

  const resolve = (data, indexes) => {
    const leafData = extractData(path, data, indexes)
    return applyTransforms(data, leafData, indexes, transforms)
  }
  self.$resolve = resolve

  const ap = f => leaf(path, transforms.concat(f))
  self.$ap = ap

  return self
}

module.exports = leaf
