import { ClassTypeORM as Class } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { IClassRepository } from "../../../../../src/core/repositories/classRepositoryInterface";
import { GetClass } from "../../../../../src/core/services/class";

describe("GetClassByClassId", () => {
    let getClass: GetClass;
    let mockRepository: jest.Mocked<IClassRepository>;

    beforeEach(() => {
        mockRepository = {
            getById: jest.fn(),
        } as unknown as jest.Mocked<IClassRepository>;

        getClass = new GetClass(mockRepository as any);
    });

    it("should return a class as an object", async () => {
        const id = "123";
        const classInstance = new Class();
        classInstance.name = "Math";
        classInstance.description = "Basic Math";
        classInstance.targetAudience = "8th grade";
        classInstance.id = id;
        mockRepository.getById.mockResolvedValue(classInstance);
        const result = await getClass.execute({ id });

        expect(mockRepository.getById).toHaveBeenCalledWith(id);
        expect(result).toEqual(classInstance);
    });
});
