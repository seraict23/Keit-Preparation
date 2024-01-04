const { clearWorkerNode } = require('../utils/workerNode')
const { delCursor } = require('../utils/cursor')

module.exports = async function init(clearCursor) {
    if(clearCursor) { await delCursor() }
    await clearWorkerNode()
}
