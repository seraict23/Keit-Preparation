import { ResultReportDto } from "../common/interfaces/dto/resultReport";
import FileObject from "../domain/entity/fileObject";
import JsonObject from "../domain/entity/jsonObject"
import Task from "../domain/entity/task";
import HttpRequest from "../domain/util/httpRequest";

class ResultManager {
    constructor(resultJson: ResultReportDto) {
        this.resultJson = resultJson;
        this.httpRequest = new HttpRequest("url", resultJson);
    }
    
    task: Task;

    resultJson: ResultReportDto;

    resultFile: FileObject;

    httpRequest: HttpRequest;

    async buildReport() {
        //
    }

    async reportToServer() {
        await this.httpRequest.postRequest();
        await this.httpRequest.filePostRequest();
    }

    async run() {
        // await this.reportToServer();
    }
}

export default ResultManager;