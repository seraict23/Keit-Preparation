import delay from "../common/functions/delay";
import Task from "../domain/entity/task";
import FileManager from "../service/fileManager";
import TaskManager from "../service/taskManager";
import WorkNodeManager from "../service/workNodeManager";
import Adapter from "../service/adapter";
import FileObject from "../domain/entity/fileObject";

class Main {
    constructor() {};

    task: Task;

    inputFile: FileObject;

    resultFile: FileObject;

    taskManager: TaskManager;

    fileManager: FileManager;

    jobManager: JobManager;

    resultManager: ResultManager;


    async taskManagerRun(): Promise<void> {
        // 반복: 서버에 임무가 있거나, 리포지토리에 임무가 있을 때
    }

    async fileManagerRun(): Promise<void> {
    }

    async jobManagerRun(): Promise<void> {
    }

    async resultManagerRun(): Promise<void> {
    }

    async run() {
        await this.taskManagerRun();
        await this.fileManagerRun();
        await this.jobManagerRun();
        await this.resultManagerRun();
    }

    // async run() {
    //     while(true) {
    //         await this.taskManager.getNewTask();
    //         if(this.taskManager.isTasksEmpty()) {
    //             delay();
    //             continue;
    //         }
    //         const task = this.taskManager.tasks.pop()

    //         const fileManagerInstance = new FileManager(task.file)
    //         this.fileManagerInstance.ready()

    //         if(!this.jobManager.isWorkNodeEmpty()){
    //             delay();
    //             continue;
    //         }
    //         const [PDF_JSON, HWP] = await this.jobManager.run()



            
    //     }
    // }
} 

export default Main;
