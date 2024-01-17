import JsonObject from "../entity/jsonObject";

class Jsonify {
    constructor() {}

    jsonData: JsonObject;

    async get() {

    }

    async eject(): Promise<JSON> {
        return JSON.parse("")
    }
}

export default Jsonify;
