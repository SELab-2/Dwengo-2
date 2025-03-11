import { GetClassParams, GetClassByClassId, GetClassByName, GetAllClasses, GetClassesByTeacherId, GetClassesByStudentId } from "../../../../src/core/services/class/getClass";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { Class } from "../../../../src/core/entities/class";

const mockClassRepository: jest.Mocked<IClassRepository> = {
    getClassById: jest.fn(),
    getClassByName: jest.fn(),
    getAllClasses: jest.fn(),
    getAllClassesByTeacherId: jest.fn(),
    getAllClassesByStudentId: jest.fn(),
} as unknown as jest.Mocked<IClassRepository>;

describe("GetClass Use Cases", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GetClassByClassId should call repository with correct ID", async () => {
        const classId = "class-123";
        const classInstance = new Class("Math", "Algebra basics", "8th grade", classId);
        mockClassRepository.getClassById.mockResolvedValue(classInstance);

        const getClassById = new GetClassByClassId(mockClassRepository);
        const params = new GetClassParams(classId);
        const result = await getClassById.execute(params);

        expect(mockClassRepository.getClassById).toHaveBeenCalledWith(classId);
        expect(mockClassRepository.getClassById).toHaveBeenCalledTimes(1);
        expect(result).toEqual(classInstance);
    });

    test("GetClassByName should call repository with correct name", async () => {
        const className = "Physics";
        const classInstance = new Class(className, "Mechanics", "High School");
        mockClassRepository.getClassByName.mockResolvedValue(classInstance);

        const getClassByName = new GetClassByName(mockClassRepository);
        const params = new GetClassParams(undefined, className);
        const result = await getClassByName.execute(params);

        expect(mockClassRepository.getClassByName).toHaveBeenCalledWith(className);
        expect(mockClassRepository.getClassByName).toHaveBeenCalledTimes(1);
        expect(result).toEqual(classInstance);
    });

    test("GetAllClasses should call repository and return all classes", async () => {
        const classes = [
            new Class("Biology", "Genetics", "High School"),
            new Class("Chemistry", "Organic Chemistry", "College"),
        ];
        mockClassRepository.getAllClasses.mockResolvedValue(classes);

        const getAllClasses = new GetAllClasses(mockClassRepository);
        const result = await getAllClasses.execute();

        expect(mockClassRepository.getAllClasses).toHaveBeenCalledTimes(1);
        expect(result).toEqual(classes);
    });

    test("GetClassesByTeacherId should call repository with correct teacher ID", async () => {
        const teacherId = "teacher-456";
        const classes = [new Class("History", "World War II", "Middle School")];
        mockClassRepository.getAllClassesByTeacherId.mockResolvedValue(classes);

        const getClassesByTeacher = new GetClassesByTeacherId(mockClassRepository);
        const params = new GetClassParams(undefined, undefined, teacherId);
        const result = await getClassesByTeacher.execute(params);

        expect(mockClassRepository.getAllClassesByTeacherId).toHaveBeenCalledWith(teacherId);
        expect(mockClassRepository.getAllClassesByTeacherId).toHaveBeenCalledTimes(1);
        expect(result).toEqual(classes);
    });

    test("GetClassesByStudentId should call repository with correct student ID", async () => {
        const studentId = "student-789";
        const classes = [new Class("Computer Science", "Programming Basics", "University")];
        mockClassRepository.getAllClassesByStudentId.mockResolvedValue(classes);

        const getClassesByStudent = new GetClassesByStudentId(mockClassRepository);
        const params = new GetClassParams(undefined, undefined, undefined, studentId);
        const result = await getClassesByStudent.execute(params);

        expect(mockClassRepository.getAllClassesByStudentId).toHaveBeenCalledWith(studentId);
        expect(mockClassRepository.getAllClassesByStudentId).toHaveBeenCalledTimes(1);
        expect(result).toEqual(classes);
    });

    test("Should throw an error if class is not found", async () => {
        mockClassRepository.getClassById.mockRejectedValue(new Error("Class not found"));

        const getClassById = new GetClassByClassId(mockClassRepository);
        const params = new GetClassParams("invalid-id");

        await expect(getClassById.execute(params)).rejects.toThrow("Class not found");
    });
});
