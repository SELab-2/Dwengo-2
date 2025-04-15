import { HTMLType, LearningObject, LearningObjectContentType, LearningObjectData } from "../../../../src/core/entities/learningObject";
import { ILearningObjectRepository } from "../../../../src/core/repositories/learningObjectRepositoryInterface";
import { GetLearningObject } from "../../../../src/core/services/learningObject";

const mockLearningObjectRepository: jest.Mocked<ILearningObjectRepository> = {
    getVersions: jest.fn(),
    getLanguages: jest.fn(),
    getwrappedLearningObject: jest.fn(),
    getrawLearningObject: jest.fn(),
    getLearningObjects: jest.fn(), 
} as unknown as jest.Mocked<ILearningObjectRepository>;


describe("GetLearningObject Service", () => {
    let service: GetLearningObject;

    beforeEach(() => {
        service = new GetLearningObject(mockLearningObjectRepository);
        jest.clearAllMocks();
    });

    it("should retrieve the latest version when no specific version is requested", async () => {
        mockLearningObjectRepository.getVersions.mockResolvedValue(["1", "2", "3"]);
        mockLearningObjectRepository.getLanguages.mockResolvedValue(["en", "nl"]);
        mockLearningObjectRepository.getrawLearningObject.mockResolvedValue(new LearningObject(
            "hruid", "id", 3, "en", "uuid", "title", "desc", "", LearningObjectContentType.PLAIN_TEXT
        ));

        const input = { id: "123", type: HTMLType.RAW };
        const result = await service.execute(input) as { metadata: any; htmlContent?: string };

        expect(mockLearningObjectRepository.getVersions).toHaveBeenCalledWith("123");
        expect(mockLearningObjectRepository.getLanguages).toHaveBeenCalledWith("123");
        expect(mockLearningObjectRepository.getrawLearningObject).toHaveBeenCalledWith("123", "en", 3);
        expect(result.metadata.version).toBe(3);
    });

    it("should use the requested version if it exists", async () => {
        mockLearningObjectRepository.getVersions.mockResolvedValue(["1", "2", "3"]);
        mockLearningObjectRepository.getLanguages.mockResolvedValue(["en", "nl"]);
        mockLearningObjectRepository.getrawLearningObject.mockResolvedValue(new LearningObject(
            "hruid", "id", 2, "en", "uuid","title", "desc", "", LearningObjectContentType.PLAIN_TEXT
        ));

        const input = { id: "123", type: HTMLType.RAW, version: "2" };
        const result = await service.execute(input) as { metadata: any; htmlContent?: string };

        expect(mockLearningObjectRepository.getrawLearningObject).toHaveBeenCalledWith("123", "en", 2);
        expect(result.metadata.version).toBe(2);
    });

    it("should fall back to English if the preferred language is not available", async () => {
        mockLearningObjectRepository.getVersions.mockResolvedValue(["1"]);
        mockLearningObjectRepository.getLanguages.mockResolvedValue(["nl", "fr"]);
        mockLearningObjectRepository.getwrappedLearningObject.mockResolvedValue(new LearningObject(
            "hruid", "id", 1, "nl", "uuid", "title", "desc", "", LearningObjectContentType.PLAIN_TEXT
        ));

        const input = { id: "123", type: HTMLType.WRAPPED, language: "de" };
        const result = await service.execute(input) as { metadata: any; htmlContent?: string };

        expect(mockLearningObjectRepository.getwrappedLearningObject).toHaveBeenCalledWith("123", "nl", 1);
        expect(result.metadata.language).toBe("nl");
    });

    it("should return wrapped content when requested", async () => {
        mockLearningObjectRepository.getVersions.mockResolvedValue(["1"]);
        mockLearningObjectRepository.getLanguages.mockResolvedValue(["en"]);
        mockLearningObjectRepository.getwrappedLearningObject.mockResolvedValue(new LearningObject(
            "hruid", "id", 1, "en", "uuid", "title", "desc", "<div>content</div>", LearningObjectContentType.PLAIN_TEXT
        ));

        const input = { id: "123", type: HTMLType.WRAPPED };
        const result = await service.execute(input) as { metadata: any; htmlContent?: string };

        expect(mockLearningObjectRepository.getwrappedLearningObject).toHaveBeenCalled();
        expect(result.htmlContent).toBe("<div>content</div>");
    });

    it("should return raw content when requested", async () => {
        mockLearningObjectRepository.getVersions.mockResolvedValue(["1"]);
        mockLearningObjectRepository.getLanguages.mockResolvedValue(["en"]);
        mockLearningObjectRepository.getrawLearningObject.mockResolvedValue(new LearningObject(
            "hruid", "id", 1, "en", "uuid", "title", "desc", "Raw content", LearningObjectContentType.PLAIN_TEXT
        ));

        const input = { id: "123", type: HTMLType.RAW };
        const result = await service.execute(input) as { metadata: any; htmlContent?: string };

        expect(mockLearningObjectRepository.getrawLearningObject).toHaveBeenCalled();
        expect(result.htmlContent).toBe("Raw content");
    });
});
