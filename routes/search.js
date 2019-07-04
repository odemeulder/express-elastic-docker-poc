var express = require('express');
var router = express.Router();

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://odm-elastic-search:9200' })

const hitToSearchResultMapper = h => (
  {
    name: h._source.firstname + ' ' + h._source.lastname,
    age: h._source.age,
    address: h._source.address
  }
)

const getSearchResults = async (q) => {
  if (!q) return []
  const query = {
    "query": {
      "multi_match" : {
        "query" : q,
        "fields" : [ "lastname^3", "firstname^2", "address" ] 
      }
    }
  }
  const { body } = await client.search({
    index: 'bank',
    body: query
  })
  return body.hits.hits.map(hitToSearchResultMapper)
}

/* GET search page. */
router.get('/', async (req, res, next) => { 
  try {
    const options = { 
      keyword: req.query.q, 
      results: await getSearchResults(req.query.q) 
    }
    res.render('search', options);
  } catch (e) {
    next(e)
  }
});


module.exports = router;
