import { FileNotInitializedError } from "../../common/error/FileError"
import FileInterface from "../../common/interfaces/fileInterface"
import Config from "../../config"
import fs from "fs"
import path from "path"

class File implements FileInterface {
    constructor(name: string, dir: string){
        this.name = name
        this.path = path.join(dir, name)
    }
    name?: string
    path?: string
}

class FileObject {
    constructor(filename: string, dir?: string) {
        let FILEFOLDER = ""
        dir ? FILEFOLDER = dir : FILEFOLDER = Config.FILE_FOLDER_PATH
        this.file = new File(filename, FILEFOLDER)
    }

    file: File;

    async save(filename: string, data: any): Promise<FileObject|void> {
        if (this.file.path === undefined || this.file.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const savePath = path.join(this.file.path, filename)
        fs.writeFileSync(savePath, data)
        return this
    }

    async copy(toPath: string): Promise<FileObject | undefined> {
        if (this.file.path === undefined || this.file.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        if (toPath === this.file.path) {
            let i = 2 
            let newFilePath = ""
            while(i > 0) {
                let toPathArr = toPath.split('.')
                toPathArr[0] += `(${i})`
                newFilePath = toPathArr.join(".")
                fs.existsSync(newFilePath) ? i+=1 : i=0
            }
            toPath = newFilePath
        }
        fs.copyFileSync(this.file.path, toPath)
        return new FileObject(path.basename(toPath), path.dirname(toPath))
    }

    async move(toFolder: string): Promise<FileObject> {
        if (this.file.path === undefined || this.file.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const toPath = path.join(Config.BASE_DIR, toFolder, this.file.name)
        fs.renameSync(this.file.path, toPath)
        this.file.path = toPath
        return this
    }

    async delete(): Promise<void> {
        if (this.file.path === undefined || this.file.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        fs.rmSync(this.file.path)
        this.file.name = undefined
        this.file.path = undefined 
    }

    async changeName(newName: string): Promise<void> {
        if (this.file.path === undefined || this.file.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const dir = path.dirname(this.file.path)
        const newPath = path.join(dir, newName)
        fs.renameSync(this.file.path, newPath)
        this.file.path = newPath
        this.file.name = newName
    }

    isExist(): Boolean {
        if (this.file.path === undefined || this.file.name === undefined) {
            return false
        }
        const result = fs.existsSync(this.file.path)
        return result
    }
}

export default FileObject;
