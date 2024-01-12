import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();
    }

    client: any;

    async init(): Promise<void> {
        this.client.on('error', (err: any) => console.log('Redis Client Error', err));

        await this.client.connect();
    }

    async add(key:string, value:string): Promise<void> {
        await this.client.set(key, value);
    }

    async get(key:string): Promise<string> {
        const value: string = await this.client.get(key)
        return value;
    }

    async delete(key:string): Promise<void> {
        await this.client.del(key)
    }

    async deleteSlow() {

    }

    async lPush(){

    }

    async rPush(){

    }

    async lPop() {

    }

    async rPop() {

    }

    async disconnect(): Promise<void> {
        this.client.disconnect()
    }
}

export default RedisClient;