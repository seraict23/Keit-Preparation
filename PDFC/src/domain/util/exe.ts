import spawn from 'child_process'
import FileObject from '../entity/fileObject';
import Config from '../../config';

const exe = spawn.spawn 

class Executor {
    constructor(file: FileObject) {
        this.file = file;
    }

    file: FileObject;

    async runPy(argument: string) {
        try {
            const PDF_FILE = this.file.file.path
            
            exe('python', [`${Config.EXE_FILE_PATH}`, `${PDF_FILE}`, `${argument}`]).stdout.on('data', (data) => {
                console.log(data.toString())
            })
        } catch (e) {
            console.error(e)
        }
    }

    async runExe() {
        exe('filename.exe', ['args1', 'args2'] ,{ shell: true }).stdout.on('data', (data) => {
            console.log(data.toString())
        })
    }
}

export default Executor;
