import { ISubmissionRepository } from "../../../../../src/core/repositories/submissionRepositoryInterface";
import { GetSubmissionActivity } from "../../../../../src/core/services/progress";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("GetSubmissionActivity", () => {
    const mockRepo: ISubmissionRepository = {
        getMonthlySubmissionCounts: jest.fn(),
    } as any;

    const service = new GetSubmissionActivity(mockRepo);

    const input = {
        idParent: "class-id-123",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockValidateUserRights.mockResolvedValue();
    });

    it("should return submissions array from tryRepoEntityOperation", async () => {
        const mockCounts = [5, 8, 12];
        (mockRepo.getMonthlySubmissionCounts as jest.Mock).mockReturnValue(mockCounts);
        const result = await service.execute("", input);

        expect(mockRepo.getMonthlySubmissionCounts).toHaveBeenCalledWith("class-id-123");
        expect(result).toEqual({ activity: mockCounts });
    });
});
