const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: 'http://localhost:9200',
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true
});

// Create child client not to make new Client() multiple times
const child = client.child({
    headers: { 'x-foo': 'bar' },
    requestTimeout: 1000
  })
  
//   client.info(console.log)
//   child.info(console.log)

module.exports= child;
