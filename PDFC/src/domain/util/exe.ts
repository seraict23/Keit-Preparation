import spawn from 'child_process';
import FileObject from '../entity/fileObject';
import Config from '../../config';
import Task from '../entity/task';
import { TaskType } from '../../common/constant/types';

const exe = spawn.spawn 

class Executor {
    constructor(argv1: string, argv2?: string) {
        this.argv1 = argv1;
        this.argv2 = argv2;
    }

    argv1: string;
    argv2?: string;

    async runExe() {
        const argvs = this.argv2 ? [this.argv1, this.argv2] : [this.argv1]

        exe('filename.exe', argvs ,{ shell: true }).stdout.on('data', (data) => {
            console.log(data.toString());
        });
    }

    async runPy() {

        const argvs = this.argv2 ? [this.argv1, this.argv2] : [this.argv1]
        try {
            exe('python', ['exe/test.py', ...argvs]).stdout.on('data', (data) => {
                console.log(data.toString());
            });
        } catch (e) {
            console.error(e);
        }
    }

    async run() {
        await this.runExe();
    }
}

export default Executor;
