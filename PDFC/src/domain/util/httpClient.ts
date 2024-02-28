import axios from "axios"
import { TaskType } from "../../common/constant/types";

export default class HttpClient {
    constructor(url: string, requestData?: object, taskType?: TaskType) {
        this.url = url;
        this.requestData = requestData ? JSON.stringify(requestData) : "";
        this.taskType = taskType ? taskType.toString() : "";
    }

    url: string;
    taskType: string;
    requestData: string;

    setData(data:any) {
        this.requestData = data;
    }

    async getRequest(extraPath?: string) {
        const merged_url = extraPath ? this.url + extraPath : this.url;

        const responseData = await axios.get(merged_url, {
            headers: {
                "Content-Type": `application/json`,
              }
        })
        .then((response) => {
            return response.data;
        });
        return responseData;
    }

    async postRequest() {
        const responseData = await axios.post(this.url, this.requestData, {
            headers: {
                "Content-Type": `application/json`,
              }
        })
        .then((response) => {
            return response.data;
        });
        return responseData;
    }

    async fileGetRequest() {
        const fileData = await axios({
            method: 'GET',
            url: this.url,
            responseType: 'blob',
            headers: {
                "Content-Type": `multipart/form-data`,
              }
        }).then((response) => {
            return response.data
        })

        return fileData;
    }

    async filePostRequest() {
        const fileData = await axios({
            method: 'POST',
            url: this.url,
            responseType: 'blob',
            headers: {
                "Content-Type": `multipart/form-data`,
              }
        }).then((response) => {
            return response.data
        })
        return fileData;
    }
}