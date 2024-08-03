export interface ApiRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
}