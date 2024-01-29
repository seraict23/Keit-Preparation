import LogInterface from "../../common/interfaces/logInterface";

class Log implements LogInterface{
    constructor(){}
    logLevel: string;
    status: string;
    moduleName: string;
    message: string;
    time: string;
}

export default Log;
