import Config from "../config";
import Log from "../domain/entity/log";
import HttpRequest from "../domain/util/httpRequest";
import { logger } from "../domain/util/logger";
import fs from "fs";

export default class LogManager {
    constructor() {
        this.httpRequest = new HttpRequest("url", {})
    }
    log?: Log;

    httpRequest: HttpRequest;

    lastLog: string = "";

    newLogs: string = "";

    record(logLevel: string, status: string, moduleName: string, message: string): LogManager {
        this.log = new Log(logLevel, status, moduleName, message)
        logger.log({
            level: this.log.logLevel, 
            message: this.log.message, 
            module: this.log.moduleName,
            status: this.log.status
        })
        this.httpRequest = new HttpRequest(Config.LOG_URL, this.log)
        return this;
    }

    // init: readline 마지막 줄 읽기  split('\n')
    findLastLog() {
       this.lastLog = fs.readFileSync(Config.LOG_FOLDER_PATH).toString().split('\n').pop() || "";
    }

    // 마지막 줄 부터 새로운 내용만 뽑아내기
    findNewLogs(): LogManager {
        let resultArray: string[] = [];
        let flag = false;

        const dataArray = fs.readFileSync(Config.LOG_FOLDER_PATH).toString().split('\n')
        dataArray.forEach((e) => {
            if (this.lastLog == e) {
                flag = true
            } else if (flag) {
                resultArray.push(e)
            }
        })
        this.newLogs = resultArray.join("\n")

        return this;
    }

    // 전송
    async send(data:any) {
        this.httpRequest.setData(data);
        await this.httpRequest.postRequest();
        // return this.httpRequest.response;
    }

    stringify() {}
}
