import createDirectory from "../common/functions/createDirectory";
import FileObject from "../domain/entity/fileObject";
import Task from "../domain/entity/task";

class FileManager {
    constructor() {}

    task: Task;

    file: FileObject;

    getFileFromTask() {

    }

    async ready() {
        await createDirectory();
        this.file.move("to")
    }

    async finish() {
        this.file.delete()
    }
}

export default FileManager;
