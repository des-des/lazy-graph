const test = require('tape')
const { graphql } = require('graphql')
const { buildSchema, introspectionQuery } = require('graphql/utilities')

const lazyGraph = require('./')

const getter = (key, ...args) => o =>
  args.length === 0 ? o[key] : getter(...args)(o[key])

const getGraph = schema => graphql(buildSchema(schema), introspectionQuery)
  .then(getter('data', '__schema'))
  .then(lazyGraph)

test('lazy-graph does something awesome', t => {
  getGraph('type Query { aNumber: Int }').then(({ graph, getQuery }) => {
    t.deepEqual(getQuery(), '', 'query can be empty')
    t.equal(
      graph.$resolve({}),
      undefined,
      'resolving top graph returns undefined'
    )

    const { aNumber } = graph

    t.equal(getQuery(), '{ aNumber }', 'accessing prop creates basic query')

    t.equal(
      aNumber.$resolve({}),
      undefined,
      'resolving empty object on leaf gives undefined'
    )

    t.equal(
      aNumber.$resolve({ aNumber: 1 }),
      1,
      'resolving object also gets the correct result'
    )

    t.end()
  })
})
