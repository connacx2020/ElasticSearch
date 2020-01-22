const client = require('./client');
const indexName = "game-of-thrones";

const search = async () => {
    const { body } = await client.search({
        index: indexName,
        body: {
            query: {
                match_all: {
                }
            },
            query: {
                match: {
                    text: "girl"
                }
            },
            query: {
                multi_match: {
                    query: "tyrion",
                    fields: ["text", "user"]
                }
            },
            query: {
                range: {
                    id: {
                        gte: 3
                    }
                }
            }

        }
    }, {
        maxRetries: 5,
        ignore: [400]
    });

    console.log(body.hits.hits);

    await client.index({
        index: indexName,
        id: '1',
        body: {
        }
    })

    const isExists = await client.exists({
        index: indexName,
        id: 1
    })
    console.log(isExists.body)
}

search().catch(console.log);
