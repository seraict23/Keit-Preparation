// job Manager에 adapter, worknodemanager통합 + app모듈의 method기능 가져오기

import { TaskType } from "../common/constant/types";
import delay from "../common/functions/delay";
import { ResultReportDto } from "../common/interfaces/dto/resultReport";
import Config from "../config";
import FileObject from "../domain/entity/fileObject";
import Task from "../domain/entity/task";
import WorkNode from "../domain/entity/workNode";
import Executor from "../domain/util/exe";

class JobManager {
    constructor(task: Task, jsonFile: FileObject, pdfFile?:FileObject) {
        this.jsonOrderFile = jsonFile;
        this.pdfFile = pdfFile;
        this.workNode = new WorkNode(task);

        const jsonFileName = jsonFile.name || "";
        const pdfFileName = (pdfFile && pdfFile.name) || undefined;
        this.executor = new Executor(jsonFileName, pdfFileName);

        this.task = task;
    }

    jsonOrderFile: FileObject;
    
    pdfFile?: FileObject;
    
    resultReport?: ResultReportDto;

    workNode: WorkNode;

    executor: Executor;

    task: Task;

    async ready() {
        return this.jsonOrderFile.isExist() && ((this.task.type == TaskType.PDF) ? this.pdfFile!.isExist() : true)
    }

    async runExe() {
        // this.executor.runExe();
        this.executor.runPy();
    }

    async setWorkNode() {
        this.workNode.setWorkNode();
    }

    async getOutput() {
        const outputReportFile = new FileObject(this.jsonOrderFile.name, Config.EXE_RESULT_PATH);
        const jsonString = await outputReportFile.readIfJson();
        this.resultReport = JSON.parse(jsonString) as ResultReportDto;
        outputReportFile.delete();
    }

    async clearWorkNode() {
        this.workNode.clearWorkNodeGracefully();
    }

    async run() : Promise<ResultReportDto> {
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
        await this.getOutput();

        return this.resultReport!;
    }
}

export default JobManager;
