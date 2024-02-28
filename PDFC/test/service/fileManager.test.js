"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
test('', () => {
    expect(1 + 1).toBe(2);
});
// test('fileManagerTest', async () => {
//     const taskManager = new TaskManager("http://localhost:8080/")
//     const task: Task = await taskManager.run();
//     const fileManager = new FileManager(task)
//     console.log(fileManager.pdfFile.name)
//     console.log(fileManager.pdfFile.path)
//     await fileManager.getFileFromTask();
//     expect(fileManager.jsonFile.isExist()).toBeTruthy()
// })
