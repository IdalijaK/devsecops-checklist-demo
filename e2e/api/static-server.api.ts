import { type APIRequestContext, type APIResponse } from "@playwright/test";

export class StaticServerApi {
    constructor(private readonly request: APIRequestContext) {}

    async get(path: string): Promise<APIResponse> {
        return this.request.get(path);
    }
}
