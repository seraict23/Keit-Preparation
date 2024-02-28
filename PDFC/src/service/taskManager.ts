import { TaskType } from "../common/constant/types";
import delay from "../common/functions/delay";
import { HWPDataJson } from "../common/interfaces/dto/hwpData";
import { PDFDataJson } from "../common/interfaces/dto/pdfData";
import { ResponseJson } from "../common/interfaces/dto/responseJson";
import FileInterface from "../common/interfaces/fileInterface";
import Task from "../domain/entity/task";
import HttpClient from "../domain/util/httpClient";


export default class TaskManager{
    constructor(url: string) {
        this.httpClient = new HttpClient(url)
    }

    httpClient: HttpClient;

    taskResponse: ResponseJson = {
        id: "",
        name: "",
        type: "",
        date: ""
    };

    taskDataResponse: any;

    task?: Task = undefined;

    isTaskEmpty:Boolean = true;

    async getResponseFromServer(): Promise<void> {
        this.taskResponse = await this.httpClient.getRequest() as ResponseJson;

        const extraPath = this.taskResponse.type.toUpperCase() + "/" + this.taskResponse.id;

        switch(this.taskResponse.type.toUpperCase()) {
            case "NONE":
                break;
            case "PDF":
                this.taskDataResponse = await this.httpClient.getRequest(extraPath) as PDFDataJson;
                this.isTaskEmpty = false;
                break;
            case "HWP":
                this.taskDataResponse = await this.httpClient.getRequest(extraPath) as HWPDataJson;
                this.isTaskEmpty = false;
                break;
            default:
                throw new Error("document type error");
        }
    }

    async getTaskFromResponse() {
        const id = this.taskResponse.id;
        const name = this.taskResponse.name;
        const type = this.taskResponse.type.toLowerCase() as TaskType;
        const data = this.taskDataResponse;
        
        let file: FileInterface = {
            name: undefined, path: undefined
        }

        if (this.isPDFDataJson(this.taskDataResponse)) {
            file = {
                name: this.taskDataResponse.filename,
                path: this.taskDataResponse.fileurl
            };
        }

        this.task = new Task(id, name, type, file, data);
    }

    async run(): Promise<Task> {
        while(this.isTaskEmpty) {
            await this.getResponseFromServer()

            await delay({second: 3, milisecond: 100})
            console.log(this.taskResponse.type)
        }
        await this.getTaskFromResponse()

        if(this.task == undefined) {
            throw new Error("task is undefined")
        }

        return this.task!;
    }

    isPDFDataJson(data: HWPDataJson | PDFDataJson): data is PDFDataJson {
        return (data as PDFDataJson).filename !== undefined && (data as PDFDataJson).fileurl !== undefined;
    }
}
