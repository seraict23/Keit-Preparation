import { TaskType } from "../../common/constant/types";
import {JsonDataInterface} from "../../common/interfaces/jsonDataInterface";

class JsonData implements JsonDataInterface{
    constructor() {}
    file: string;
    createdBy: string;
    createdAt: string;
    type: TaskType;
    status: string;
    content: any;
}

class JsonObject {
    constructor() {}

    data: JsonData
    
    setStatus() {

    }

    toJson() {

    }

    toString() {

    }
}

export default JsonObject