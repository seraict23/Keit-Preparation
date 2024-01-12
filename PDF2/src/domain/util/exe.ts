import spawn from 'child_process'
import FileObject from '../entity/fileObject';

const exe = spawn.spawn

class Executor {
    constructor() {
    }

    file: FileObject;

    async runPy() {
        exe('py', ['./filename.py', 'asdf', 'param2']).stdout.on('data', (data) => {
                console.log(data.toString())
            })
    }

    async runExe() {

    }
}

export default Executor;
