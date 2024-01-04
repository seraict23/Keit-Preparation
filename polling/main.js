const adapter               = require('./service/adaptor')
const job                   = require('./service/job')
const init                  = require('./service/init')
const nodeChecker           = require('./service/findEmptyWorkNode')

module.exports = async function main(initCursor) {
    await init(initCursor)
    while(true) {
        if (await nodeChecker()) { continue }
        const response = await adapter()
        await job(response)
    }
}
