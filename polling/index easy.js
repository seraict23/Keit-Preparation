require('dotenv').config()
const fetch = require('node-fetch')
const connection = {
    "host": process.env.HOST,
    "port": process.env.PORT
}
const { createClient } = require('redis')

const main = async () => {
    const client = await createClient(connection)
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
     
    let count = 0

    // clear workingnode
    await client.del('working-node')

    while(count < 10) {
        // 작업 커서
        let cursor = await client.get('working-cursor')
        cursor = cursor ? cursor : '1' // 첫 시작일 경우 1부터 시작되게

        // 워킹 노드
        let workingNode = await client.get('working-node')

        if (workingNode !== null) {
            await asyncTimeout("워킹 노드가 비어있지 않으므로 2초간 대기합니다.", 2000) // 일정 시간 멈추는 함수
            continue;
        }

        // 검색
        const response = await fetch(`https://reqres.in/api/users/${cursor}`, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json()
        const status = await response.status
        
        // 작업    
        if (status == 200) {
            const processId = 'WN'+Date.now().toString();
            await client.set(`working-node`, `${processId}`)

            console.log(`작업을 시작합니다. process-ID:${processId}`)
            setTimeout(async() => {
                console.log(data)
                console.log(status)
                await client.set(`working-node`, '', {EX:3}) // 바로 지우지 않고 3초 뒤 삭제 되게 합니다. 워킹 노드가 종료되고 초기화할 시간을 주기 위해서
                console.log('작업에는 대략 10초가 걸렸습니다. 워킹 노드는 3초 후에 종료됩니다.')
            }, 10000)
        }

        console.log((Number(cursor)+1).toString())

        await client.set(`working-cursor`, `${(Number(cursor)+1).toString()}`, {EX:15})

        count++;
    }
}

main()

async function asyncTimeout(message, time) {
    console.log(message)
    return new Promise((callback, j) =>{
        setTimeout(callback, time)
    })
} 
