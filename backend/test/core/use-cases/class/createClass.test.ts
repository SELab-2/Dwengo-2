import { DatabaseError } from '../../../../src/config/error';
import { Class } from '../../../../src/core/entities/class';
import { CreateClass } from '../../../../src/core/use-cases/class/createClass';

// Mock repository
const mockClassRepository = {
    createClass: jest.fn(),
};

describe('CreateClass', () => {
    let createClass: CreateClass;

    beforeEach(() => {
        createClass = new CreateClass(mockClassRepository as any);
        jest.clearAllMocks(); // Reset mocks voor elke test
    });

    test('Should create a class and return it with an ID', async () => {
        const inputClass = new Class("Math 101", "Basic math class", "Primary School");
        const createdClass = new Class("Math 101", "Basic math class", "Primary School", "mock-class-id");

        mockClassRepository.createClass.mockResolvedValue(createdClass);

        const result = await createClass.execute(inputClass);

        expect(result).toEqual(createdClass);
        expect(mockClassRepository.createClass).toHaveBeenCalledWith(inputClass);
    });

    test('Should throw a DatabaseError if creation fails', async () => {
        const inputClass = new Class("Math 101", "Basic math class", "Primary School");

        mockClassRepository.createClass.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createClass.execute(inputClass)).rejects.toThrow(DatabaseError);
        expect(mockClassRepository.createClass).toHaveBeenCalledWith(inputClass);
    });
});
