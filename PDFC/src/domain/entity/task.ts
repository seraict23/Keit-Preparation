import { TaskType } from "../../common/constant/types";
import FileInterface from "../../common/interfaces/fileInterface";
import TaskInterface from "../../common/interfaces/taskInterface";

class Task implements TaskInterface {
    constructor(id: string, name: string, type: TaskType, file: FileInterface, data: any) {
        this.id = id
        this.name = name // json file name
        this.type = type
        this.file = file // pdf file name
        this.data = data
    }
    id: string;
    name: string;
    type: TaskType;
    file: FileInterface;
    data: any;
}

export default Task;
