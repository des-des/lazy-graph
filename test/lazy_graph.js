const test = require('tape')
const { graphql } = require('graphql')
const { buildSchema, introspectionQuery } = require('graphql/utilities')

const lazyGraph = require('../')

const getter = (key, ...args) => o =>
  args.length === 0 ? o[key] : getter(...args)(o[key])

const getGraph = schema => graphql(buildSchema(schema), introspectionQuery)
  .then(getter('data', '__schema'))
  .then(lazyGraph)

test('integration test', t => {
  getGraph(`
    type Query { friends: [Person] }
    type Person { firstName: String lastName: String }
  `).then(({ graph, getQuery }) => {
    const { friends: { firstName } } = graph

    const mockData = {
      friends: [
        { firstName: 'des', lastName: 'des' },
        { firstName: 'someone', lastName: 'else' }
      ]
    }

    t.deepEqual(
      firstName.$resolve(mockData),
      [ 'des', 'someone' ],
      'correct resolution '
    )

    t.deepEqual(
      firstName.$ap(fName => `${fName}!`).$resolve(mockData),
      ['des!', 'someone!'],
      'correct resolution '
    )

    t.deepEqual(
      getQuery(),
      '{ friends { firstName } }',
      'correct query'
    )

    t.end()
  })
})
