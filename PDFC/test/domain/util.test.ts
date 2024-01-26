import path from "path";
import delay from "../../src/common/functions/delay";
import Config from "../../src/config";
import FileObject from "../../src/domain/entity/fileObject";
import Executor from "../../src/domain/util/exe";
import RedisCleint from '../../src/domain/util/redisClient';

test('redis:add and get', async () => {
    const redisClient = new RedisCleint()
    await redisClient.add('test_key', 'test_value')
    const result = await redisClient.get('test_key')
    expect(result).toBe('test_value')
})

test('redis:del', async () => {
    const redisClient = new RedisCleint()
    await redisClient.delete('test_key')
    const result = await redisClient.get('test_key')
    expect(result).toBeNull
})

test('redis: delete gracefully', async () => {
    const redisClient = new RedisCleint()
    await redisClient.add('test_key2', 'test_value2')
    await redisClient.deleteSlow('test_key2', 1)
    await delay({
        second: 2,
        milisecond: 1500
    })
    const lateResult = await redisClient.get('test_key2')
    expect(lateResult).toBe(null)
})

test('exe: test', async () => {
    const fileObject = new FileObject('test.txt')
    const exe = new Executor(fileObject)
    const result_path = path.join(Config.FILE_FOLDER_PATH, 'test2.txt')
    exe.runPy(result_path)
    await delay({second: 3, milisecond: 1000})

    const fileObject2 = new FileObject('test2.txt')
    expect(fileObject2.isExist()).toBeTruthy()

    await delay({second: 3, milisecond: 1000})

    await fileObject2.delete()
})
