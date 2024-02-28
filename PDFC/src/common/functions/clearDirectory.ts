import fs from "fs";
import path from "path";

export default async function clearDirectory(dirpath: string): Promise<void> {
    const listdir = fs.readdirSync(dirpath);

    listdir.forEach((i) => {
        (i === "test.txt") || fs.unlinkSync(path.join(dirpath, i));
    })
}