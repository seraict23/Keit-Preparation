const { setWorkerNode, expireWorkerNode } = require('../utils/workerNode')
const { setCursor, getCursor } = require('../utils/cursor')

module.exports = async function job(value) {
    const cursor = await getCursor()
    const [data, status] = value

    if(status) {
        const processId = 'WN'+Date.now().toString();
        console.log(`작업을 시작합니다. process-ID:${processId}`)
    
        await setWorkerNode(processId)
        setTimeout(async() => {
            console.log(status)
            console.log(data)
            await expireWorkerNode()
            console.log('작업에는 대략 10초가 걸렸습니다. 워킹 노드는 3초 후에 종료됩니다.')
        }, 10000)
    } else {
        console.log(`${cursor}에 해당하는 데이터가 없습니다. 다음 데이터를 탐색합니다.`)
    }
    await setCursor((Number(cursor)+1).toString()) 
}
