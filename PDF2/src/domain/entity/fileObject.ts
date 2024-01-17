import FileInterface from "../../common/interfaces/fileInterface"

class File implements FileInterface {
    constructor(){}
    name: string
    path: string
}

class FileObject {

    constructor() {}

    file: File;

    save(to: string): string {
        return ""
    }

    copy(){}

    move(to: string): string {
        return ""
    }

    delete(): void {}

    changeName(to: string): string {
        return ""
    }

    isExist(): Boolean {
        return true
    }
}

export default FileObject