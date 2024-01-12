import createDirectory from "../common/functions/createDirectory";
import FileObject from "../domain/entity/fileObject";

class FileManager {
    constructor() {}

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
