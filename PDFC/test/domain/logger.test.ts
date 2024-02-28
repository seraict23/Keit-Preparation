import { logger } from "../../src/domain/util/logger"
test('', () => {
    expect(1+1).toBe(2)
})
// test('loggtest', () => {
//     logger.info({
//         message: "hello world3",
//         module: "logger.test.ts",
//         status: "FAILED"
//     })

//     const childLog = logger.child({ module: "logger.test.ts", status: "SUCCESS" })
//     childLog.info("hello world4")
    
//     expect(1+1).toBe(2)
// })
