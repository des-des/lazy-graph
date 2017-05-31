const test = require('tape')

const seq = require('../src/seq.js')

const mockInner = {
  $resolve: (_, indexes) => indexes,
  someFunc: () => mockInner
}
Object.defineProperty(
  mockInner,
  'withGetter',
  { get: () => mockInner, enumerable: true }
)

test('seq', t => {
  const mySeq = seq(mockInner, ['path'])

  t.ok(mySeq.isSeq, 'is seq')

  t.deepEqual(
    mySeq.$resolve({ path: ['a', 'b'] }),
    [[0], [1]],
    'resolves correctly'
  )

  t.deepEqual(
    mySeq.withGetter.$resolve({ path: ['a', 'b'] }),
    [[0], [1]],
    'getters get back result in wrapper that resolves correctly'
  )

  t.deepEqual(
    mySeq.someFunc().$resolve({ path: ['a', 'b'] }),
    [[0], [1]],
    'function props get back result in wrapper that resolves correctly'
  )

  t.end()
})
