const mapSection = indexes => part => part === '$' ? indexes.shift() : part

const getIn = (path, data) => {
  let acc = data
  for (let i = 0; i < path.length; i++) {
    const next = acc[path[i]]

    if (next === undefined || typeof next !== 'object') return next

    acc = next
  }

  return acc
}

const extractData = (path, data, indexes = []) => {
  const getterPath = path.map(mapSection(indexes))

  return getIn(getterPath, data)
}

module.exports = {
  extractData
}
