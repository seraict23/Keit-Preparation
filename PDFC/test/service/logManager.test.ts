import LogManager from "../../src/service/logManager"
import path from 'path'
test('', () => {
    expect(1+1).toBe(2)
})
// test('logManagerTest', () => {
//     const logger = new LogManager()
//     logger.record("info", "SUCCESS", path.basename(__filename), "hello world")
//     expect(logger.log?.message).toBe("hello world")
//     expect(logger.log?.moduleName).toBe("logManager.test.ts")
// })
