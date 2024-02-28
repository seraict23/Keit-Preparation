import FileObject from "../domain/entity/fileObject";
import JsonObject from "../domain/entity/jsonObject"
import Task from "../domain/entity/task";
import HttpRequest from "../domain/util/httpRequest";

class ResultManager {
    constructor(resultJson: JsonObject, resultFile: FileObject) {
        this.resultJson = resultJson;
        this.resultFile = resultFile;
        this.httpRequest = new HttpRequest("url", resultJson);
    }
    
    task: Task;

    resultJson: JsonObject;

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
        await this.reportToServer();
    }
}

export default ResultManager;