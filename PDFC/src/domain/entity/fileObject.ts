import { FileNotInitializedError } from "../../common/error/FileError"
import FileInterface from "../../common/interfaces/fileInterface"
import Config from "../../config"
import fs from "fs"
import path from "path"

class FileObject implements FileInterface {
    constructor(filename?: string, dir?: string) {
        this.name = filename;
        this.path = dir;
    }

    name?: string;

    path?: string;

    async save(filename: string, data: any): Promise<FileObject|void> {
        if (this.path === undefined || this.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const savePath = path.join(this.path, filename)
        fs.writeFileSync(savePath, data)
        return this
    }

    async copy(toPath: string): Promise<FileObject | undefined> {
        if (this.path === undefined || this.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        if (toPath === this.path) {
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
        fs.copyFileSync(this.path, toPath)
        return new FileObject(path.basename(toPath), path.dirname(toPath))
    }

    async move(toFolder: string): Promise<FileObject> {
        if (this.path === undefined || this.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const toPath = path.join(Config.BASE_DIR, toFolder, this.name)
        fs.renameSync(this.path, toPath)
        this.path = toPath
        return this
    }

    async delete(): Promise<void> {
        if (this.path !== undefined && this.name !== undefined) {        
            fs.rmSync(this.path)
            this.name = undefined
            this.path = undefined 
        }
    }

    async changeName(newName: string): Promise<void> {
        if (this.path === undefined || this.name === undefined) {
            throw new FileNotInitializedError("The file has not been initialized")
        }
        const dir = path.dirname(this.path)
        const newPath = path.join(dir, newName)
        fs.renameSync(this.path, newPath)
        this.path = newPath
        this.name = newName
    }

    isExist(): Boolean {
        if (this.path === undefined || this.name === undefined) {
            return false
        }
        const result = fs.existsSync(this.path)
        return result
    }

    async readIfJson(): Promise<string> {
        if(this.name!.indexOf('json') == -1) {
            throw new Error("this file is not json")
        }
        
        const jsonFilePathToRead = path.join(this.path!, this.name!)
        const jsonFile = fs.readFileSync(jsonFilePathToRead, 'utf-8')
        const jsonData = JSON.parse(jsonFile)

        return JSON.stringify(jsonData);
    }
}

export default FileObject;
