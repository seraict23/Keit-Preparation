// job Manager에 adapter, worknodemanager통합 + app모듈의 method기능 가져오기

import { TaskType } from "../common/constant/types";
import delay from "../common/functions/delay";
import FileObject from "../domain/entity/fileObject";
import JsonObject from "../domain/entity/jsonObject";
import Task from "../domain/entity/task";
import WorkNode from "../domain/entity/workNode";
import Executor from "../domain/util/exe";

class JobManager {
    constructor(task: Task, jsonFile: FileObject, pdfFile?:FileObject){
        this.jsonOrderFile = jsonFile;
        this.pdfFile = pdfFile;
        this.workNode = new WorkNode(task);

        const jsonFilePath = (jsonFile.path || "") + "/" + (jsonFile.name || "");
        const pdfFilePath = ((pdfFile && pdfFile.path) || "") + "/" + ((pdfFile && pdfFile.name) || "");
        this.executor = new Executor(jsonFilePath, pdfFilePath);

        this.task = task;
    }

    jsonOrderFile: FileObject;
    
    pdfFile?: FileObject;
    
    outputFile?: FileObject = undefined;

    workNode: WorkNode;

    executor: Executor;

    task: Task;

    async ready() {
        return this.jsonOrderFile.isExist() && (this.task.type == TaskType.PDF ? this.pdfFile!.isExist() : true)
    }


    async runExe() {
        // this.executor.runExe();
        this.executor.runPy();
    }

    async setWorkNode() {
        this.workNode.setWorkNode();
    }

    async getOutput() {

    }

    async makeOutput(fileName: string, dir: string): Promise<JsonObject> {
        this.outputFile = new FileObject(fileName, dir);
        return new JsonObject("", "", TaskType.HWP, {});
    }

    async clearWorkNode() {
        this.workNode.clearWorkNodeGracefully();
    }

    async run() : Promise<void> {
        console.log(this.executor.argv1, this.executor.argv2)
        console.log(this.workNode.id)

        while(await this.workNode.isOccupied()) {
            await delay({second: 3, milisecond: 3000});
        }
        if (!await this.ready()) {
            throw Error('file isn\'t there');
        }

        // await this.setWorkNode();
        await this.runExe();
        // await this.getOutput();
        // await this.makeOutput();
    }
}

export default JobManager;
