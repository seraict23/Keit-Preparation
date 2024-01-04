const { getWorkerNode } = require('../utils/workerNode')
const asyncTimeout = require('../utils/timeout')

module.exports = async function findEmptyWorkNode() {
    const workerNode = await getWorkerNode();
    if (workerNode !== null) {
        await asyncTimeout("워킹 노드가 비어있지 않습니다. 2초 후 다시 시작합니다.", 2000)
        return true
    } else {
        console.log("빈 워킹 노드를 찾았습니다. 작업을 개시합니다.")
        return false
    }
}
