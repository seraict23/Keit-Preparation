import FileObject from "../domain/entity/fileObject";
import JsonObject from "../domain/entity/jsonObject"

class ResultManager {
    constructor() {}
    
    task: Task;

    resultJson: JsonObject;

    resultFile: FileObject;

    async reportToServer() {

    }
}

export default ResultManager