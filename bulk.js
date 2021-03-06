const client = require('./client');

const indexName = "game-of-thrones";

const start = async () => {
    
    await client.indices.create(
        {
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        id: { type: 'integer' },
                        text: { type: 'text' },
                        user: { type: 'keyword' },
                        time: { type: 'date' }
                    }
                }
            }
        },
        {
            ignore: [400]
        });
    console.log("Index 'my-index' created.");
    const dataset = [
        { index: { _index: indexName } },
        {
            id: 1,
            text: 'If I fall, don\'t bring me back.',
            user: 'jon',
            date: new Date()
        },

        { index: { _index: indexName } },
        {
            id: 2,
            text: 'Witer is coming',
            user: 'ned',
            date: new Date()
        },

        { index: { _index: indexName } },
        {
            id: 3,
            text: 'A Lannister always pays his debts.',
            user: 'tyrion',
            date: new Date()
        },

        { index: { _index: indexName } },
        {
            id: 4,
            text: 'I am the blood of the dragon.',
            user: 'daenerys',
            date: new Date()
        },

        { index: { _index: indexName } },
        {
            id: 5, // change this value to a string to see the bulk response with errors
            text: 'A girl is Arya Stark of Winterfell. And I\'m going home.',
            user: 'arya',
            date: new Date()
        }]

    // const body = dataset.flatMap(doc => [{ index: { _index: indexName } }, doc]);
    const { body: bulkResponse } = await client.bulk({ refresh: true, body: dataset });

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        })
        console.log(erroredDocuments)
    }

    const { body: count } = await client.count({ index: indexName })
    console.log(count)

}
start().catch(console.log);
