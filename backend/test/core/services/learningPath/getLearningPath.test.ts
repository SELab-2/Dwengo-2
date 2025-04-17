
import { z } from "zod";
import { ILearningPathRepository } from "../../../../src/core/repositories/learningPathRepositoryInterface";
import { getLearningPathSchema } from "../../../../src/application/schemas";
import { GetLearningPath } from "../../../../src/core/services/learningPath";
import { LearningPath } from "../../../../src/core/entities/learningPath";

// Mock repository
const mockLearningPathRepository: jest.Mocked<ILearningPathRepository> = {
    getLanguages: jest.fn(),
    getLearningPath: jest.fn(),
} as unknown as jest.Mocked<ILearningPathRepository>;

// Testdata
const validInput = { id: "123", language: "nl" };
const parsedInput = getLearningPathSchema.parse(validInput);

describe("GetLearningPath", () => {
    let service: GetLearningPath;
    const mockValue: LearningPath = new LearningPath(validInput.id,validInput.language,"","","","",0,[],[],0,0,[],)

    beforeEach(() => {
        jest.clearAllMocks();
        service = new GetLearningPath(mockLearningPathRepository);
        mockLearningPathRepository.getLearningPath.mockResolvedValue(mockValue);
    });

    it("Gets a learningPath in requested language", async () => {
        mockLearningPathRepository.getLanguages.mockResolvedValue(["nl", "en"]);
        

        const result = await service.execute(parsedInput);

        expect(mockLearningPathRepository.getLearningPath).toHaveBeenCalledWith("123", "nl");
        expect(result).toEqual(mockValue.toObject());
    });

    it("Should default to English if requested language is not available", async () => {
        mockLearningPathRepository.getLanguages.mockResolvedValue(["en", "fr"]);

        const result = await service.execute({ id: "123", language: "nl" });

        expect(mockLearningPathRepository.getLearningPath).toHaveBeenCalledWith("123", "en");
        expect(result).toEqual(mockValue.toObject());
    });

    it("Falls back to first language if English and requested is not available", async () => {
        mockLearningPathRepository.getLanguages.mockResolvedValue(["nl", "de"]);

        const result = await service.execute({ id: "123", language: "fr" });

        expect(mockLearningPathRepository.getLearningPath).toHaveBeenCalledWith("123", "nl");
    });

    it("Defaults to English when no specific language is requested", async () => {
        mockLearningPathRepository.getLanguages.mockResolvedValue(["nl", "en"]);

        const result = await service.execute({ id: "123" });

        expect(mockLearningPathRepository.getLearningPath).toHaveBeenCalledWith("123", "en");
    });
});
