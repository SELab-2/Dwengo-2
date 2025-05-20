import { LearningObject, LearningObjectContentType } from "../../../../../src/core/entities/learningObject";
import { ILearningObjectRepository } from "../../../../../src/core/repositories/learningObjectRepositoryInterface";
import { GetAllLearningObjects } from "../../../../../src/core/services/learningObject";

describe("GetAllLearningObjects", () => {
    let mockRepo: jest.Mocked<ILearningObjectRepository>;
    let service: GetAllLearningObjects;

    beforeEach(() => {
        mockRepo = {
            getLearningObjects: jest.fn(),
        } as unknown as jest.Mocked<ILearningObjectRepository>;

        service = new GetAllLearningObjects(mockRepo);
    });

    it("should call repository with correct query params", async () => {
        const input = {
            searchTerm: "robot",
            language: "nl",
            minDifficulty: 2,
        };

        const mockLO = new LearningObject(
            "hruid123", "id123", 1, "nl", "uuid123", "Titel", "Beschrijving", "", LearningObjectContentType.PLAIN_TEXT
        );
        mockRepo.getLearningObjects.mockResolvedValue([mockLO]);

        const result = await service.execute("", input);

        expect(mockRepo.getLearningObjects).toHaveBeenCalledWith("?searchTerm=robot&language=nl&min_difficulty=2");

        expect(result).toEqual({
            learningObjects: [mockLO.toMetaData()],
        });
    });

    it("should return empty array if repository returns none", async () => {
        const input = {};
        mockRepo.getLearningObjects.mockResolvedValue([]);

        const result = await service.execute("", input);

        expect(mockRepo.getLearningObjects).toHaveBeenCalledWith("");
        expect(result).toEqual({ learningObjects: [] });
    });

    it("should not include undefined or null fields in query params", async () => {
        const input = {
            searchTerm: undefined,
            language: "en",
            maxTime: undefined,
        };

        mockRepo.getLearningObjects.mockResolvedValue([]);

        await service.execute("", input);

        expect(mockRepo.getLearningObjects).toHaveBeenCalledWith("?language=en");
    });
});
