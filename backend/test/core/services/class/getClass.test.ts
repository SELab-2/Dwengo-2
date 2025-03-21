import { Class } from "../../../../src/core/entities/class";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { GetClassByClassId } from "../../../../src/core/services/class";

describe("GetClassByClassId", () => {
    let getClassByClassId: GetClassByClassId;
    let mockRepository: jest.Mocked<IClassRepository>;

    beforeEach(() => {
        mockRepository = {
            getClassById: jest.fn(),
        } as unknown as jest.Mocked<IClassRepository>;

        getClassByClassId = new GetClassByClassId(mockRepository as any);
    });

    it("should return a class as an object", async () => {
        const id = "123";
        const classInstance = new Class("Math", "Basic Math", "8th grade", id);
        mockRepository.getClassById.mockResolvedValue(classInstance);
        const result = await getClassByClassId.execute({ id });

        expect(mockRepository.getClassById).toHaveBeenCalledWith(id);
        expect(result).toEqual(classInstance.toObject());
    });
});
