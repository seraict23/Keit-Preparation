import LogInterface from "../../common/interfaces/logInterface";

class Log implements LogInterface{
    constructor(logLevel: string, status: string, moduleName: string, message: string, time?: string) {
        this.logLevel=logLevel;
        this.status=status;
        this.moduleName=moduleName;
        this.message=message;
        this.time= time ? time : "";
    }
    logLevel: string;
    status: string;
    moduleName: string;
    message: string;
    time: string;
}

export default Log;
 