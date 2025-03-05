import { CreateStudent } from "../../../../src/core/use-cases/student/createStudent";
import { Student } from "../../../../src/core/entities/student";

const mockStudentRepository = {
  findByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createStudent: jest.fn().mockResolvedValue("mock-student-id"), // Simulate student
};


describe("CreateStudent", () => {
  let createStudent: CreateStudent;

  beforeEach(() => {
    createStudent = new CreateStudent(mockStudentRepository as any);
  });

  test("Should throw error because of invalid email", async () => {
    await expect(
      createStudent.execute(new Student("incorrect-email", "John", "Doe", "hashedpassword123", "Harvard", [], "1"))
    ).rejects.toThrow("Invalid email");
  });

  test("Should normalize input correctly", async () => {
    const student: Student = new Student(
      "test@example.com",
      "  John  ",
      "  Doe  ",
      "hashedpassword123",
      "Yale",
      [] as string[],
      "4"
    );

    jest.spyOn(createStudent as any, "validateInput").mockResolvedValue(undefined);

    await expect(createStudent.execute(student)).resolves.not.toThrow();

    expect(student.email).toBe("test@example.com");
    expect(student.firstName).toBe("John");
    expect(student.familyName).toBe("Doe");
    expect(student.schoolName).toBe("Yale")
  });

  test("Should throw error if email is already in use", async () => {
    mockStudentRepository.findByEmail.mockResolvedValue(true);
  
    await expect(
      createStudent.execute(new Student("test@example.com", "John", "Doe", "hashedpassword123", "Oxford", [], "5"))
    ).rejects.toThrow("Email already in use");
  
    // Control if findByEmail is correctly called
    expect(mockStudentRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
  });
  
});
