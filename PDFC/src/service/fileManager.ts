import { TaskType } from "../common/constant/types";
import clearDirectory from "../common/functions/clearDirectory";
import Config from "../config";
import FileObject from "../domain/entity/fileObject";
import JsonObject from "../domain/entity/jsonObject";
import Task from "../domain/entity/task";
import HttpClient from "../domain/util/httpClient";

class FileManager {
    constructor(task: Task) {
        this.task = task;
        this.jsonOrderFile = new FileObject();
        this.jsonObject = new JsonObject(this.task.name, "createdBy", this.task.type, this.task.data);
    }

    task: Task;

    pdfFile?: FileObject = undefined;

    jsonOrderFile: FileObject;

    jsonObject: JsonObject;

    httpClient: HttpClient;

    async getFileFromTask(): Promise<void> {
        this.jsonOrderFile = this.jsonObject.toFile(this.task.name);

        if (this.task.type === TaskType.PDF) {
            // const fileData = await this.httpClient.fileGetRequest();
            // await this.pdfFile.save(this.task.name, fileData);

            this.pdfFile = new FileObject('test_pdf.pdf', Config.FILE_FOLDER_PATH); // 파일 다운로드 방법 생길때까지 임시

        } else if (this.task.type === TaskType.HWP) {
            // pass
        }
    }

    async ready() {
        // await createDirectory('file');
        // await this.file.move("to");
        // await clearDirectory(Config.FILE_FOLDER_PATH);
    }

    async finish() {
        if(this.pdfFile) { this.pdfFile.delete(); }
        this.jsonOrderFile.delete();
    }

    async run() {
        await this.ready();
        await this.getFileFromTask();
    }
}

export default FileManager;
