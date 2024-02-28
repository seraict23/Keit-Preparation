import Task from "../../src/domain/entity/task";
import FileManager from "../../src/service/fileManager";
import JobManager from "../../src/service/jobManager"
import TaskManager from "../../src/service/taskManager"

test('job manager test', async () => {
    const taskManager = new TaskManager('http://localhost:8080/')
    const task: Task = await taskManager.run();

    console.log(task.data)

    const fileManager = new FileManager(task);
    await fileManager.run();

    const pdf = fileManager.pdfFile;
    const json = fileManager.jsonOrderFile;

    const jobManager = new JobManager(task, json, pdf);
    await jobManager.run()

    expect(fileManager.jsonOrderFile.isExist()).toBeTruthy
})
