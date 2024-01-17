// job Manager에 adapter, worknodemanager통합 + app모듈의 method기능 가져오기

import FileObject from "../domain/entity/fileObject";
import WorkNode from "../domain/entity/workNode";
import Executor from "../domain/util/exe";

class JobManager {
    constructor(){}

    inputFile: FileObject;
    
    outputFile: FileObject;

    workNode: WorkNode;

    executor: Executor;

    async runExe() {}

    async setWorkNode() {}

    async makeOutput() {}

    async clearWorkNode() {}

}
