# lazy-graph [![Build Status](https://secure.travis-ci.org/des-des/lazy-graph.svg?branch=master)](https://travis-ci.org/des-des/lazy-graph) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

lazy representation of graphql schema

WIP!

here is me demoing a simpler version of this idea: https://des-des.github.io/view-graphql/ / https://github.com/des-des/view-graphql/

## Installation

```bash
npm install --save lazy-graph
```

## Usage

```javascript
// You could make a request to fetch this, but better embed it in your html
const schema = window.__GRAPH_SCHEMA__

const { graph, getQuery } = require('lazy-graph')(schema)

// okay we still have not made a request to the server, but we are going to start interacting

const { user: { blogs, name } } = graph

// Now we have two objects, blogs is a sequence, name is a leaf
const profile = name.$ap(n => `<div class='user-name'> ${n} </div>`)

// we still have not requested any data from the server

const { title, description } = blogs
const titleDivs = title.$ap(t => `<div class='blog-title'>${t}</div>`)

const postDivs = post.$ap(t => `<div class='blog-post'>${t}</div>`)

const render = data => `
  <div class='user-blogs'>
    ${profile.$resolve(data)}
    ${zip(postDivs.$resolve(data), titleDivs.$resolve(data)).join('')}
  </div>
`

// now we are going to make a request to our server
// We have exactly the right query
const query = getQuery() // '{ user { blogs { title description } name } }'

postRequest(query)
  .then(render)
  .then(html => {
    injectIntoDom(html)
  })
```


## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by Eoin McCarthy ([@desmond_eoin](https://twitter.com/desmond_eoin)).

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
