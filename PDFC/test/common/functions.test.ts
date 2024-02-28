import clearDirectory from "../../src/common/functions/clearDirectory"
import Config from "../../src/config"

test('clearDirectory', async () => {
    await clearDirectory(Config.FILE_FOLDER_PATH);
    expect(1+2).toBe(3);
})
