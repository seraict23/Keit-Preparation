import * as path from "path"

const setting = {
    fileFolder: "file",
    tempFolder: "tmp",
    workNodeName: "work_node_asdf",
    exeFileFolder: "exe",
    exeFileName: "test.py",
}

export default class Config {
    static readonly BASE_DIR = path.resolve()
    static readonly FILE_FOLDER_PATH = path.join(path.resolve(), setting.fileFolder)
    static readonly TEMP_FOLDER_PATH = path.join(path.resolve(), setting.tempFolder)
    static readonly WORKNODE = setting.workNodeName
    static readonly EXE_FILE_PATH = path.join(path.resolve(), setting.exeFileFolder, setting.exeFileName)
}
