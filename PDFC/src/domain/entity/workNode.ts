import Config from "../../config";
import RedisClient from "../util/redisClient";

class WorkNode {
    constructor() {
        // let today = new Date()
        // this.id = today.toLocaleTimeString()
        this.id = Date.now().toString()
    }

    id: string;

    async setWorkNode(redisClient?: RedisClient) {
        redisClient || (redisClient = new RedisClient())
        await redisClient.add(Config.WORKNODE, this.id)
    }

    async getWorkNode(redisClient?: RedisClient) {
        redisClient || (redisClient = new RedisClient())
        return await redisClient.get(Config.WORKNODE)
    }

    async isOccupied(redisClient?: RedisClient) {
        redisClient || (redisClient = new RedisClient())
        return await redisClient.get(Config.WORKNODE) !== null ? true : false
    }

    async clearWorkNode(redisClient?: RedisClient) {
        redisClient || (redisClient = new RedisClient())
        await redisClient.delete(Config.WORKNODE)
    }

    async clearWorkNodeGracefully(redisClient?: RedisClient) {
        redisClient || (redisClient = new RedisClient())
        await redisClient.deleteSlow(Config.WORKNODE)
    }

}

export default WorkNode;