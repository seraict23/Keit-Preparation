import { TaskType } from "../../common/constant/types";
import {JsonDataInterface} from "../../common/interfaces/jsonDataInterface";

class JsonData implements JsonDataInterface{
    constructor(file: string, createdBy: string, type: TaskType, content: any) {
        let today = new Date()
        this.file = file;
        this.createdBy = createdBy;
        this.createdAt = today.toLocaleTimeString();
        this.type = type;
        this.content = content;
    }
    file: string;
    createdBy: string;
    createdAt: string;
    type: TaskType;
    status: string = "";
    content: any;
}

class JsonObject {
    constructor(file: string, createdBy: string, type: TaskType, content: any) {
        this.data = new JsonData(file, createdBy, type, content)
    }

    data: JsonData
    
    setStatus(statusCode: number|string) {
        typeof(statusCode) === "number" ? this.data.status = statusCode.toString() : this.data.status = statusCode
        return this;
    }

    toJson(): string {
        return JSON.stringify(this.data, null, "\t")
    }

    toString(): string {
        return JSON.stringify(this.data)
    }
}

export default JsonObject