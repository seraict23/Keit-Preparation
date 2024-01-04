const { createClient } = require('redis')
const { connection } = require('../resources/config')

async function setCursor(num) {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.set('cursor', num.toString());

    await client.disconnect();
}

async function getCursor() {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    const result = await client.get('cursor');

    await client.disconnect();

    return result ? result : '1';
}

async function delCursor() {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.del('cursor');

    await client.disconnect();
}

module.exports = {
    setCursor,
    getCursor,
    delCursor
}