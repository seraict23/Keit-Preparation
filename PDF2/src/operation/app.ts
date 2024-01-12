import delay from "../common/functions/delay";
import Task from "../domain/entity/task";
import FileManager from "../service/fileManager";
import TaskManager from "../service/taskManager";
import WorkNodeManager from "../service/workNodeManager";
import Adapter from "../service/adapter";

class Main {
    constructor() {};

    taskManager: TaskManager;

    fileManager: FileManager;

    workNodeManager: WorkNodeManager;

    adapter: Adapter

    getNewTask() {
        this.taskManager.getNewTask()
    }

    async job(item: Task) {
        this.workNodeManager.setNode()
        this.fileManager.getFileFromTask(item)   
        this.fileManager.ready()    
        await this.adapter.runExe()
    }

    async finishJob() {
        while(this.workNodeManager.checkEmpty()) {
            delay()
        }
        this.fileManager.finish()
    }

    async run() {
        while(true) {
            if(this.getNewTask()) {
                delay();
                continue;
            }
            this.taskManager.tasks.list.forEach((item) => {
                if (this.workNodeManager.checkEmpty()) {
                    delay();
                    continue;
                }
                
                this.job(item)

                this.finishJob()

            })
            
        }
    }
} 

export default Main;
