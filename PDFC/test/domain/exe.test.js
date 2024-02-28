"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exe_1 = __importDefault(require("../../src/domain/util/exe"));
test('py test', () => {
    const exe = new exe_1.default('he', 'hi');
});
