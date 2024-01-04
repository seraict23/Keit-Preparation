const fetch = require('node-fetch')
const { getCursor } = require('../utils/cursor')

let response;

async function caller() {
    const cursor = await getCursor();

    response = await fetch(`https://reqres.in/api/users/${cursor}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    })
    const data = await response.json()
    const status = (response.status === 200) ? true : false 
    return [ data, status ]
}

module.exports = caller