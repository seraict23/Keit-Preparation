import FileObject from "../domain/entity/fileObject";
import HttpRequest from "../domain/util/httpRequest";
import RedisClient from "../domain/util/redisClient";
import Tasks from "../domain/entity/tasks";
import delay from "../common/functions/delay";
import Task from "../domain/entity/task";

class TaskManager {
    constructor(tasks?: Tasks){
        this.redisClient = new RedisClient()
        this.httpRequest = new HttpRequest("url", {})
        this.tasks = tasks || new Tasks()
    }

    redisClient: RedisClient;

    // fileObject: FileObject;

    httpRequest: HttpRequest;

    tasks: Tasks;

    async isTasksEmpty(): Promise<boolean> {
        return this.tasks.count > 0 ? true : false
    }

    async getNewTask() {
        await this.httpRequest.getRequest();
        const response: any = this.httpRequest.response;
        if(response.status == 200) {
            const task: Task = new Task(
                    response.id, 
                    response.name, 
                    response.type, 
                    response.file, 
                    response.data
                )
            this.tasks.add(task)    
        }
    }

    popTask(): Task|undefined {
        const task: Task|undefined = this.tasks.pop()
        return task;
    }

    // async finishTask() {}

    async run(): Promise<Task> {
        while(await this.isTasksEmpty()) {
            await this.getNewTask()
            await delay({
                second:0,
                milisecond:3000
            })
        }
        const task: Task = this.popTask()!;
        return task;
    }
}

export default TaskManager;
