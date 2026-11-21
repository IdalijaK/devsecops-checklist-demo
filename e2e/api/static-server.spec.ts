import { expect, test } from "@playwright/test";
import { StaticServerApi } from "./static-server.api";
import { missingEndpoint, staticServerEndpoints } from "../test-data/api-data";

test.describe("static HTTP endpoints", () => {
    for (const endpoint of staticServerEndpoints) {
        test(`GET ${endpoint.path} returns an expected response`, async ({ request }) => {
            const api = new StaticServerApi(request);
            const response = await api.get(endpoint.path);

            expect(response.status()).toBe(200);
            expect(response.headers()["content-type"]).toContain(endpoint.contentType);
        });
    }

    test("GET returns 404 for an unknown endpoint", async ({ request }) => {
        const api = new StaticServerApi(request);
        const response = await api.get(missingEndpoint);

        expect(response.status()).toBe(404);
    });
});
