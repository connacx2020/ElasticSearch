const client = require('./client');
const indexName = "game-of-thrones";

const searchWith_asStream = async () => {
    const { body } = await client.search({
        index: indexName,
        body: {
            query: {
                match: {
                    user: 'tyrion'
                }
            }
        }
    }, {
        maxRetries: 5,
        ignore: [400],
        asStream: true
    });
    
    // stream async iteration, available in Node.js ≥ 10
    var payload = ''
    body.setEncoding('utf8')
    for await (const chunk of body) {
        payload += chunk
    }
    console.log(JSON.parse(payload));

    // classic stream callback style
    var payload = ''
    body.setEncoding('utf8')
    body.on('data', chunk => { payload += chunk })
    body.on('error', console.log)
    body.on('end', () => {
        console.log(JSON.parse(payload))
    })
}

searchWith_asStream().catch(console.log);
