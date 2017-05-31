const test = require('tape')

const node = require('../src/node.js')

const mockGraph = {
  fetchTypeSchema: name => ({
    fields: [{ name: 'dummyName', type: 'dummyType' }]
  }),
  tree: (type, path) => ({ type, path })
}

test('node', t => {
  const myNode = node(mockGraph, 'nodeName', ['path'])

  t.ok(myNode.isNode, 'is a node')

  t.deepEqual(
    myNode.dummyName,
    { type: 'dummyType', path: ['path', 'dummyName'] }
  )

  t.throws(myNode.$resolve, 'cannot resolve')

  t.throws(myNode.$ap, 'cannot ap')

  t.end()
})
