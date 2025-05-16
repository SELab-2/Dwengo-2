import { ApiError, ErrorCode } from "../../../../../../../src/application/types";
import { LearningPath, LearningPathData } from "../../../../../../../src/core/entities/learningPath";
import { DatasourceLearningPath } from "../../../../../../../src/infrastructure/dwengo_backend/data/data_sources/http/datasourceLearningPath";

global.fetch = jest.fn();

describe("DatasourceLearningPath", () => {
    let datasource: DatasourceLearningPath;

    beforeEach(() => {
        jest.clearAllMocks();
        datasource = new DatasourceLearningPath("https://dwengo.api");
    });

    describe("getLearningPath", () => {
        it("Should fetch a learningPath in the correct language", async () => {
            const mockData: LearningPathData[] = [
                {
                    _id: "1",
                    hruid: "test-path",
                    language: "nl",
                    title: "Test Leerpad NL",
                    description: "Beschrijving NL",
                    image: "base64string",
                    num_nodes: 3,
                    keywords: "programmeren educatie",
                    target_ages: [10, 12, 14],
                    min_age: 10,
                    max_age: 14,
                    nodes: [],
                },
                {
                    _id: "2",
                    hruid: "test-path",
                    language: "en",
                    title: "Test Learning Path EN",
                    description: "Description EN",
                    image: "base64string",
                    num_nodes: 3,
                    keywords: "programming education",
                    target_ages: [10, 12, 14],
                    min_age: 10,
                    max_age: 14,
                    nodes: [],
                },
            ];
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            const result = await datasource.getLearningPath("test-path", true, "nl");

            expect(fetch).toHaveBeenCalledWith("https://dwengo.api/api/learningPath/search");
            expect(result).toBeInstanceOf(LearningPath);
            expect(result.toObject(true)).toEqual({
                id: "1",
                hruid: "test-path",
                language: "nl",
                title: "Test Leerpad NL",
                description: "Beschrijving NL",
                image: "base64string",
                numNodes: 3,
                keywords: ["programmeren", "educatie"],
                targetAges: [10, 12, 14],
                minAge: 10,
                maxAge: 14,
                nodes: [],
            });
        });

        it("Should fetch first learningPath if language not specified", async () => {
            const mockData: LearningPathData[] = [
                {
                    _id: "1",
                    hruid: "test-path",
                    language: "nl",
                    title: "Test Leerpad NL",
                    description: "Beschrijving NL",
                    image: "base64string",
                    num_nodes: 3,
                    keywords: "programmeren educatie",
                    target_ages: [10, 12, 14],
                    min_age: 10,
                    max_age: 14,
                    nodes: [],
                },
                {
                    _id: "2",
                    hruid: "test-path",
                    language: "en",
                    title: "Test Learning Path EN",
                    description: "Description EN",
                    image: "base64string",
                    num_nodes: 3,
                    keywords: "programming education",
                    target_ages: [10, 12, 14],
                    min_age: 10,
                    max_age: 14,
                    nodes: [],
                },
            ];
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            const result = await datasource.getLearningPath("test-path", true);

            expect(fetch).toHaveBeenCalledWith("https://dwengo.api/api/learningPath/search");
            expect(result).toBeInstanceOf(LearningPath);
            expect(result.toObject(true)).toEqual({
                id: "1",
                hruid: "test-path",
                language: "nl",
                title: "Test Leerpad NL",
                description: "Beschrijving NL",
                image: "base64string",
                numNodes: 3,
                keywords: ["programmeren", "educatie"],
                targetAges: [10, 12, 14],
                minAge: 10,
                maxAge: 14,
                nodes: [],
            });
        });

        it("Should throw error when API request fails", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 400,
                statusText: "Bad Request",
            });
            await expect(datasource.getLearningPath("test-path", true, "nl")).rejects.toEqual({
                code: ErrorCode.BAD_REQUEST,
                message: "Error fetching from dwengo api: 400, Bad Request",
            } as ApiError);
        });

        it("Should throw error if the learningPath cannot be found", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue([]),
            });

            await expect(datasource.getLearningPath("test-path", true, "nl")).rejects.toEqual({
                code: ErrorCode.NOT_FOUND,
                message: "No learningPath exists with this hruid.",
            } as ApiError);
        });

        it("Should throw error if the requested language is not available", async () => {
            const mockData: LearningPathData[] = [
                {
                    _id: "1",
                    hruid: "test-path",
                    language: "fr",
                    title: "Chemin d'apprentissage FR",
                    description: "Description FR",
                    image: "base64string",
                    num_nodes: 3,
                    keywords: "programmation éducation",
                    target_ages: [10, 12, 14],
                    min_age: 10,
                    max_age: 14,
                    nodes: [],
                },
            ];
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            await expect(datasource.getLearningPath("test-path", true, "nl")).rejects.toEqual({
                code: ErrorCode.NOT_FOUND,
                message: "No learningPath exists with this hruid.",
            } as ApiError);
        });
    });

    describe("getLearningPaths", () => {
        it("Should fetch all learningPaths", async () => {
            const mockData: LearningPathData[] = [
                {
                    _id: "1",
                    hruid: "test-path-1",
                    language: "nl",
                    title: "Test Leerpad 1",
                    description: "Beschrijving 1",
                    image: "base64string1",
                    num_nodes: 2,
                    keywords: "leren coderen",
                    target_ages: [8, 10],
                    min_age: 8,
                    max_age: 10,
                    nodes: [],
                },
                {
                    _id: "2",
                    hruid: "test-path-2",
                    language: "en",
                    title: "Test Learning Path 2",
                    description: "Description 2",
                    image: "base64string2",
                    num_nodes: 4,
                    keywords: "coding education",
                    target_ages: [12, 14],
                    min_age: 12,
                    max_age: 14,
                    nodes: [],
                },
            ];
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            const result = await datasource.getLearningPaths("?language=nl", true);

            expect(fetch).toHaveBeenCalledWith("https://dwengo.api/api/learningPath/search?language=nl");
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(LearningPath);
            expect(result[0].toObject(false)).toEqual({
                id: "1",
                hruid: "test-path-1",
                language: "nl",
                title: "Test Leerpad 1",
                description: "Beschrijving 1",
                image: "base64string1",
                numNodes: 2,
                keywords: ["leren", "coderen"],
                targetAges: [8, 10],
                minAge: 8,
                maxAge: 10,
            });
            expect(result[1].toObject(true)).toEqual({
                id: "2",
                hruid: "test-path-2",
                language: "en",
                title: "Test Learning Path 2",
                description: "Description 2",
                image: "base64string2",
                numNodes: 4,
                keywords: ["coding", "education"],
                targetAges: [12, 14],
                minAge: 12,
                maxAge: 14,
                nodes: [],
            });
        });

        it("Should return an empty array if there are no learningPaths", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue([]),
            });

            const result = await datasource.getLearningPaths("?language=nl", true);

            expect(result).toEqual([]);
        });
    });
});
