require('./test/leaf.js')
require('./test/node.js')
require('./test/seq.js')
require('./test/lazy_graph.js')

process.on('unhandledRejection', r => console.error(r))
