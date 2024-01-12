import axios from 'axios';
import HttpInterface from '../../common/interfaces/httpInterface';
import ResponseInterface from '../../common/interfaces/responseInterface';

class Http implements HttpInterface {
    constructor(){}
    url: string;
    method: string;
    data: any;
}

class Response implements ResponseInterface {
    constructor(){}
    data: any;
    status: number;
    contentType: string;

    // optional
    file?: any;
}

class HttpRequest {
    constructor() {  }

    http: Http;

    response: Response;

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

        return responseData;
    }

    async postRequest() {
    }

    async getRequest() {
    }

    async fileGetRequest() {
    }

    async filePostRequest() {
    }
}

export default HttpRequest;
