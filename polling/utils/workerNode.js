const { createClient } = require('redis')
const { connection } = require('../resources/config')

async function setWorkerNode(processId) {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.set('worker-node', processId);

    await client.disconnect();
}

async function getWorkerNode() {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    const result = await client.get('worker-node');

    await client.disconnect();

    return result;
}

async function expireWorkerNode() {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.set('worker-node', '', {EX:3});

    await client.disconnect();
}

async function clearWorkerNode() {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.del('worker-node');

    await client.disconnect();
}

module.exports = {
    setWorkerNode,
    getWorkerNode,
    expireWorkerNode,
    clearWorkerNode
}
