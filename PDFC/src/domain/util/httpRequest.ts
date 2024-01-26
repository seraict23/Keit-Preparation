import axios from 'axios';
import HttpInterface from '../../common/interfaces/httpInterface';
import ResponseInterface from '../../common/interfaces/responseInterface';

class Http implements HttpInterface {
    constructor(url: string, data: any){
        this.url = url
        this.method = data
    }
    url: string;
    method: string = "";
    data: any;
}

class Response implements ResponseInterface {
    constructor(data: any, status: number, contentType: string){
        this.data = data;
        this.status = status;
        this.contentType = contentType;
    }
    data: any;
    status: number;
    contentType: string;

    // optional
    file?: any;
}

class HttpRequest {
    constructor(url: string, data: any) { 
        this.http = new Http(url, data)
        this.response = undefined
     }

    http: Http;

    response?: Response;

    setMethod(method: string) {
        this.http.method = method
    }

    async request() {
        const responseData = await axios({
            method: this.http.method,
            url: this.http.url,
            data: this.http.data
        })
        .then((response) => {
            return response.data;
        });
        this.response = new Response(
            responseData.data,
            responseData.status,
            responseData.headers['content-type']
        )
        return this.response;
    }

    async postRequest() {
        const responseData = await axios.post(this.http.url, JSON.stringify(this.http.data), {
            headers: {
                "Content-Type": `application/json`,
              }
        })
        .then((response) => {
            return response.data;
        });
        this.response = new Response(
            responseData.data,
            responseData.status,
            responseData.headers['content-type']
        )
        return this.response;
    }

    async getRequest() {
        const responseData = await axios.get(this.http.url, {
            headers: {
                "Content-Type": `application/json`,
              }
        })
        .then((response) => {
            return response.data;
        });
        this.response = new Response(
            responseData.data,
            responseData.status,
            responseData.headers['content-type']
        )
        return this.response;
    }

    async fileGetRequest() {
        const fileDataResponse = await axios({
            method: this.http.method,
            url: this.http.url,
            responseType: 'blob',
            headers: {
                "Content-Type": `multipart/form-data`,
              }
        }).then((response) => {
            return response
        })

        this.response = new Response(
            {},
            fileDataResponse.status,
            fileDataResponse.headers['content-type']
        )
        this.response.file = fileDataResponse.data
        return this.response;
    }

    async filePostRequest() {
        const fileData = await axios({
            method: this.http.method,
            url: this.http.url,
            responseType: 'blob',
            headers: {
                "Content-Type": `multipart/form-data`,
              }
        }).then((response) => {
            return response
        })
        return fileData
    }
}

export default HttpRequest;
