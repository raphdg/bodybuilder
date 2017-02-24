import test from 'tape'
import bodyBuilder from '../src'

test('should nest', (t) => {
  t.plan(1)

  const result = bodyBuilder()
    .nestedBool('should', (q) => {
      return q
        .filter('term', 'user', 'kimchy')
        .filter('term', 'user', 'herald')
    }, (q) => {
      return q
        .notFilter('term', 'user', 'johnny')
        .notFilter('term', 'user', 'cassie')
    })
    .andFilter('term', 'user', 'keming')
    .build()

  console.log(JSON.stringify(result, null, 2));

  t.deepEqual(result, {
     query: {
        bool: {
           should: [
              {
                 bool: {
                    must: [
                       { term: { user: "kimchy" } },
                       { term: { user: "herald" } }
                    ]
                 }
              },
              {
                 bool: {
                    must_not: [
                       { term: { user: "johnny" } },
                       { term: { user: "cassie" } }
                    ]
                 }
              }
           ]
        }
     }
  })
})

