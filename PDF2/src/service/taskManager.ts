import FileObject from "../domain/entity/fileObject";
import HttpRequest from "../domain/util/httpRequest";
import RedisClient from "../domain/util/redisClient";
import Tasks from "../domain/entity/tasks";


class TaskManager {
    constructor(){}

    redisClient: RedisClient;

    fileObject: FileObject;

    httpRequest: HttpRequest;

    tasks: Tasks;

    async isTasksEmpty() {}

    async getNewTask() {}

    async popTask() {}

    async finishTask() {}
}

export default TaskManager;