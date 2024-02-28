import Task from "../domain/entity/task";
import FileManager from "../service/fileManager";
import JobManager from "../service/jobManager";
import TaskManager from "../service/taskManager";


export default async function testmain() {
    const taskManager = new TaskManager('http://localhost:8080/')
    const task: Task = await taskManager.run();

    console.log(task.data)

    const fileManager = new FileManager(task);
    await fileManager.run();

    const pdf = fileManager.pdfFile;
    const json = fileManager.jsonOrderFile;

    const jobManager = new JobManager(task, json, pdf);
    await jobManager.run()
}
