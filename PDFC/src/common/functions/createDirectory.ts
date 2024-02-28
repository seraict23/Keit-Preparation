import fs from 'fs';
import * as path from "path";
import Config from '../../config';

async function createDirectory(folderName: string) {
    const filePath = path.join(Config.BASE_DIR, folderName)
    fs.mkdir(filePath, function(e){
        if(!e || (e && e.code === 'EEXIST')){
            //do something with contents
        } else {
            //debug
            console.log(e);
        }
    });
}

export default createDirectory;