const test = require('tape')

const leaf = require('../src/leaf.js')

test('empty leaf', t => {
  const emptyLeaf = leaf([])

  t.ok(emptyLeaf.isLeaf, 'is a leaf')
  t.equal(
    emptyLeaf.$resolve('hello'),
    'hello',
    'resolves to input if undefined'
  )

  t.end()
})

test('leaf with path', t => {
  const myLeaf = leaf(['outer', 'inner'])

  const mockData = { outer: { inner: 3 } }

  t.equal(
    myLeaf.$resolve({}),
    undefined,
    'resolves to undifined if cannot find'
  )

  t.equal(myLeaf.$resolve(mockData), 3, 'resolves to correct value')

  t.equal(
    myLeaf.$ap(x => x * 2).$resolve(mockData),
    6,
    'ap gets applied'
  )

  t.equal(
    myLeaf.$ap(x => myLeaf.$ap(y => x * y)).$resolve(mockData),
    9,
    'ap returning leaf also gets applied'
  )

  t.end()
})

test('leaf with indexes', t => {
  const myLeaf = leaf(['outer', '$'])

  const mockData = { outer: { inner: 3 } }

  t.equal(myLeaf.$resolve(mockData, ['inner']), 3, 'resolves to correct value')

  t.end()
})
