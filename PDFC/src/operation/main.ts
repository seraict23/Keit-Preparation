import FileObject from "../domain/entity/fileObject";
import Task from "../domain/entity/task";
import HttpRequest from "../domain/util/httpRequest";
import FileManager from "../service/fileManager";
import JobManager from "../service/jobManager";
import LogManager from "../service/logManager";
import ResultManager from "../service/resultManager";
import TaskManager from "../service/taskManager";

class Main {
    constructor() {

    }

    taskManager: TaskManager;

    fileManager: FileManager;

    jobManager: JobManager;

    logManager: LogManager;

    resultManager: ResultManager;

    async run() {
        const task: Task = await this.taskManager.run();

        const file: FileObject = await this.fileManager.run();

        this.jobManager = new JobManager(file, task)
        const report: HttpRequest = await this.jobManager.run();

        this.resultManager = new ResultManager(report);
        this.resultManager.run();
    }
}
