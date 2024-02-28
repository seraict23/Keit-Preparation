"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../domain/util/httpRequest"));
const redisClient_1 = __importDefault(require("../domain/util/redisClient"));
const tasks_1 = __importDefault(require("../domain/entity/tasks"));
const delay_1 = __importDefault(require("../common/functions/delay"));
const task_1 = __importDefault(require("../domain/entity/task"));
class TaskManager {
    constructor(tasks) {
        this.redisClient = new redisClient_1.default();
        this.httpRequest = new httpRequest_1.default("url", {});
        this.tasks = tasks || new tasks_1.default();
    }
    isTasksEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasks.count > 0 ? true : false;
        });
    }
    getNewTask() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.httpRequest.getRequest();
            const response = this.httpRequest.response;
            if (response.status == 200) {
                const task = new task_1.default(response.id, response.name, response.type, response.file, response.data);
                this.tasks.add(task);
            }
        });
    }
    popTask() {
        const task = this.tasks.pop();
        return task;
    }
    // async finishTask() {}
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            while (yield this.isTasksEmpty()) {
                yield this.getNewTask();
                yield (0, delay_1.default)({
                    second: 0,
                    milisecond: 3000
                });
            }
            const task = this.popTask();
            return task;
        });
    }
}
exports.default = TaskManager;
