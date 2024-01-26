import FileObject from "../../src/domain/entity/fileObject"
import Config from "../../src/config"
import path from 'path'
import JsonObject from "../../src/domain/entity/jsonObject"
import { TaskType } from "../../src/common/constant/types"
import WorkNode from "../../src/domain/entity/workNode"
import delay from "../../src/common/functions/delay"
import RedisClient from "../../src/domain/util/redisClient"

test('fileObject exist test', () => {
    const fileObj = new FileObject('test.txt', "")
    const answer = fileObj.isExist()
    expect(answer).toBe(true)
    const fileObj2 = new FileObject('test2.txt', "")
    const answer2 = fileObj2.isExist()
    expect(answer2).toBe(false)
})

test('fileObject move test', () => {
    const fileObj = new FileObject('test.txt', "")
    fileObj.move('tmp')
    const fileObj2 = new FileObject('test.txt', Config.TEMP_FOLDER_PATH)
    expect(fileObj2.isExist()).toBe(true)
    fileObj2.move('file')
})

test('fileObject copy and delete test', () => {
    const fileObj = new FileObject('test.txt')
    fileObj.copy(path.join(Config.TEMP_FOLDER_PATH, fileObj.file.name!))
    const fileObj2 = new FileObject('test.txt', Config.TEMP_FOLDER_PATH)
    expect(fileObj2.isExist()).toBe(true)
    fileObj2.delete()
    expect(fileObj2.isExist()).toBe(false)
})

test('copy file name test', async () => {
    const fileObj = new FileObject('test.txt')
    const fileObj2 = await fileObj.copy(path.join(fileObj.file.path!))
    expect(fileObj2?.file.name).toBe('test(2).txt')
    fileObj2?.delete()
})

test('file object error test', async () => {
    const fileObj = new FileObject('test.txt')
    const fileObj2 = await fileObj.copy(fileObj.file.path!)
    expect(fileObj2?.file.name).toBe('test(2).txt')
    await fileObj2!.delete()
    expect(fileObj2!.isExist()).toBeFalsy()
    try {
        expect(async () => {await fileObj2?.changeName('hi')})
    } catch(e: any) {
        console.error(e)
        expect(e.message).toBe('The file has not been initialized')
    }
})

test('json object: test', () => {
    const jsonObject = new JsonObject(
        "test.txt", "spark", TaskType.PDF, {}
    )
    // console.log(jsonObject.data.createdAt)
    jsonObject.setStatus("hi")
    expect(jsonObject.data.status).toBe("hi")

    const jsonResult = jsonObject.toJson()
    const stringResult = jsonObject.toString()
    // console.log(jsonResult)
    // console.log(stringResult)
    expect(jsonResult).not.toBeNull()
    expect(stringResult).not.toBeNull()
})

test('WorkNode: test', async () => {
    const now = Date.now()
    await delay({
        second: 0,
        milisecond: 100
    })
    const workNode = new WorkNode();
    expect(Number(workNode.id)).toBeGreaterThan(now);

    const isOccupied = await workNode.isOccupied()
    expect(isOccupied).toBeFalsy()

    const redisCleint = new RedisClient()
    await workNode.setWorkNode(redisCleint)
    const getWorkNode = await workNode.getWorkNode()
    expect(getWorkNode).toBe(workNode.id)
    const isOccupied2 = await workNode.isOccupied(redisCleint)
    expect(isOccupied2).toBeTruthy()
    await workNode.clearWorkNode()

    const isOccupied3 = await workNode.isOccupied(redisCleint)
    expect(isOccupied3).toBeFalsy()
})
