import { LearningPath } from "../../../../../src/core/entities/learningPath";
import { ILearningPathRepository } from "../../../../../src/core/repositories/learningPathRepositoryInterface";
import { GetAllLearningPaths } from "../../../../../src/core/services/learningPath";


describe("GetAllLearningPaths", () => {
    let mockRepo: jest.Mocked<ILearningPathRepository>;
    let service: GetAllLearningPaths;

    beforeEach(() => {
        mockRepo = {
            getLearningPaths: jest.fn(),
        } as unknown as jest.Mocked<ILearningPathRepository>;

        service = new GetAllLearningPaths(mockRepo);
    });

    it("should call repository with correct query params", async () => {
        const input = {
            language: "nl",
            title: "robotica",
        };

        const fakePath = new LearningPath(
            "id123",
            "nl",
            "robot-path",
            "Robotica Intro",
            "Een korte uitleg over robots",
            "base64img",
            3,
            ["robot", "intro"],
            [10, 12],
            10,
            12,
            [] // nodes
        );

        mockRepo.getLearningPaths.mockResolvedValue([fakePath]);

        const result = await service.execute(input);

        expect(mockRepo.getLearningPaths).toHaveBeenCalledWith("?language=nl&title=robotica");
        expect(result).toEqual({
            learningPaths: [fakePath.toObject()],
        });
    });

    it("should return empty array when no learning paths are found", async () => {
        const input = {};
        mockRepo.getLearningPaths.mockResolvedValue([]);

        const result = await service.execute(input);

        expect(mockRepo.getLearningPaths).toHaveBeenCalledWith("");
        expect(result).toEqual({ learningPaths: [] });
    });

    it("should not include null or undefined values in query string", async () => {
        const input = {
            title: undefined,
            hruid: undefined,
            language: "en",
        } as any;

        mockRepo.getLearningPaths.mockResolvedValue([]);

        await service.execute(input);

        expect(mockRepo.getLearningPaths).toHaveBeenCalledWith("?language=en");
    });
});
