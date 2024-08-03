import axios, { AxiosRequestConfig } from "axios";
import { ApiRequest } from "@/types/api.request";

export const fetchApi = async (request: ApiRequest): Promise<any> => {
    try {
        const config: AxiosRequestConfig = {
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.body,
        };

        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};
