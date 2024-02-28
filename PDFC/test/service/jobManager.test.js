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
const fileManager_1 = __importDefault(require("../../src/service/fileManager"));
const jobManager_1 = __importDefault(require("../../src/service/jobManager"));
const taskManager_1 = __importDefault(require("../../src/service/taskManager"));
test('job manager test', () => __awaiter(void 0, void 0, void 0, function* () {
    const taskManager = new taskManager_1.default('http://localhost:8080/');
    const task = yield taskManager.run();
    console.log(task.data);
    const fileManager = new fileManager_1.default(task);
    yield fileManager.run();
    const pdf = fileManager.pdfFile;
    const json = fileManager.jsonOrderFile;
    const jobManager = new jobManager_1.default(task, json, pdf);
    yield jobManager.run();
    expect(fileManager.jsonOrderFile.isExist()).toBeTruthy;
}));
