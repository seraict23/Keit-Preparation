import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();
    }

    client: any;

    async add(key:string, value:string): Promise<void> {
        await this.withConnect(async () => {
            await this.client.set(key, value);
        })
    }

    async get(key:string): Promise<string> {
        const result = await this.withConnect(async () => {
            const value: string = await this.client.get(key)
            return value
        })
        return result;
    }

    async delete(key:string): Promise<void> {
        await this.withConnect(async () => {
            await this.client.del(key);
        })
    }

    async deleteSlow(key:string, ex:number = 3) {
        const value=""
        await this.withConnect(async () => {
            await this.client.set(key, value, {
                EX: ex
            });
        })
    }

    // async lPush(){

    // }

    // async rPush(){

    // }

    // async lPop() {

    // }

    // async rPop() {

    // }

    async withConnect(callback: any) {
        this.client.on('error', (err: any) => console.log('Redis Client Error', err));
        await this.client.connect();
        const result = await callback();
        await this.client.disconnect();

        return result;
    }
}

export default RedisClient;
