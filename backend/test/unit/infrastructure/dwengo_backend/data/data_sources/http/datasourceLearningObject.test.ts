import { ErrorCode } from "../../../../../../../src/application/types";
import { DatasourceLearningObject } from "../../../../../../../src/infrastructure/dwengo_backend/data/data_sources/http/datasourceLearningObject";


describe("DatasourceLearningObject", () => {
    let datasource: DatasourceLearningObject;
    const mockHost = "https://dwengo.org/backend";
    const hruid = "test-hruid";
    const language = "en";
    const version = 1;

    beforeEach(() => {
        datasource = new DatasourceLearningObject(mockHost);
        jest.spyOn(global, "fetch").mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Herstelt fetch na elke test
    });

    test("getVersions should return an array of versions", async () => {
        const mockData = [{ hruid, language, version, title: "Test Title" }, { hruid, language, version: 2, title: "Test Title" }];
        global.fetch = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );

        const versions = await datasource.getVersions(hruid);
        expect(versions).toEqual(["1", "2"]);
    });

    test("getVersions should throw an error if fetch fails", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce(
            new Response(null, { status: 400, statusText: "Bad Request" })
        );

        await expect(datasource.getVersions(hruid)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Error fetching from dwengo api: 400, Bad Request",
        });
    });

    test("getLanguages should return an array of languages", async () => {
        const mockData = [{ hruid, language, version, title: "Test Title" }, { hruid, language: "nl", version, title: "Test Title" }];
        global.fetch = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );

        const languages = await datasource.getLanguages(hruid);
        expect(languages).toEqual(["en", "nl"]);
    });

    test("getMetaData should return a LearningObject", async () => {
        const mockData = [{ hruid, language, version, title: "Test Title" }];
        global.fetch = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );

        const result = await datasource.getMetaData(hruid, language, version);
        expect(result).toEqual(expect.objectContaining(mockData[0]));
    });

    test("getRawLearningObject should return a LearningObject with raw HTML content", async () => {
        const mockData = [{ hruid, language, version, title: "Test Title" }];
        global.fetch = jest.fn()
            .mockResolvedValueOnce(
                new Response(JSON.stringify(mockData), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
            )
            .mockResolvedValueOnce(
                new Response("<h1>Raw Content</h1>", { status: 200 })
            );

        const result = await datasource.getRawLearningObject(hruid, language, version);
        expect(result.htmlContent).toBe("<h1>Raw Content</h1>");
    });

    test("getLearningObjects should return an array of LearningObjects", async () => {
        const mockData = [{ hruid, language, version, title: "Test Title" }];
        global.fetch = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );

        const results = await datasource.getLearningObjects("?language=nl");
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual(expect.objectContaining(mockData[0]));
    });
});
