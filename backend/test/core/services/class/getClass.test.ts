import { Class } from "../../../../src/core/entities/class";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { GetClassByClassId, GetClassParams } from "../../../../src/core/services/class";

describe("GetClassByClassId", () => {
    let getClassByClassId: GetClassByClassId;
    let mockRepository: jest.Mocked<IClassRepository>;

    beforeEach(() => {
        mockRepository = {
            getById: jest.fn(),
        } as unknown as jest.Mocked<IClassRepository>;

        getClassByClassId = new GetClassByClassId(mockRepository as any);
    });

    it("should return a class as an object", async () => {
        const classInstance = new Class("Math", "Basic Math", "8th grade", "123");
        mockRepository.getById.mockResolvedValue(classInstance);

        const params = new GetClassParams("123");
        const result = await getClassByClassId.execute(params);

        expect(mockRepository.getById).toHaveBeenCalledWith("123");
        expect(result).toEqual(classInstance.toObject());
    });
});
