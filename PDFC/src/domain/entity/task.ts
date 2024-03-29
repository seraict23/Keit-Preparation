import { TaskType } from "../../common/constant/types";
import TaskInterface from "../../common/interfaces/taskInterface";
import FileObject from "./fileObject";

class Task implements TaskInterface {
    constructor() {}
    id: string;
    name: string;
    type: TaskType;
    file: FileObject;
    data: any;
}

export default Task;
