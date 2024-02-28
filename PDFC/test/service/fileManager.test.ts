import FileObject from "../../src/domain/entity/fileObject";
import Task from "../../src/domain/entity/task"
import FileManager from "../../src/service/fileManager";
import TaskManager from "../../src/service/taskManager"
test('', () => {
    expect(1+1).toBe(2)
})
// test('fileManagerTest', async () => {
//     const taskManager = new TaskManager("http://localhost:8080/")

//     const task: Task = await taskManager.run();

//     const fileManager = new FileManager(task)

//     console.log(fileManager.pdfFile.name)
//     console.log(fileManager.pdfFile.path)

//     await fileManager.getFileFromTask();

//     expect(fileManager.jsonFile.isExist()).toBeTruthy()
// })