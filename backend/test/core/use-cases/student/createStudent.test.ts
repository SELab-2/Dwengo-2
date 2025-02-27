import { CreateStudent } from "../../../../src/core/use-cases/student/createStudent";

describe("CreateStudent", () => {
  let createStudent: CreateStudent;

  beforeEach(() => {
    createStudent = new CreateStudent();
  });

  test("Should throw error because of invalid email", async () => {
    await expect(
      createStudent.execute({
        id: "1",
        email: "incorrect-email",
        first_name: "John",
        family_name: "Doe",
        password_hash: "hashedpassword123",
      })
    ).rejects.toThrow("Invalid email");
  });

  test("Should throw error because of empty firstname", async () => {
    await expect(
      createStudent.execute({
        id: "2",
        email: "test@example.com",
        first_name: "",
        family_name: "Doe",
        password_hash: "hashedpassword123",
      })
    ).rejects.toThrow("Invalid first name");
  });

  test("Should throw error because of empty lastname", async () => {
    await expect(
      createStudent.execute({
        id: "3",
        email: "test@example.com",
        first_name: "John",
        family_name: "",
        password_hash: "hashedpassword123",
      })
    ).rejects.toThrow("Invalid family name");
  });

  test("Should normalize input correctly", async () => {
    const studentData = {
      id: "4",
      email: "  TEST@EXAMPLE.COM  ",
      first_name: "  John  ",
      family_name: "  Doe  ",
      password_hash: "hashedpassword123",
    };

    jest.spyOn(createStudent as any, "validateInput").mockResolvedValue(undefined);

    await expect(createStudent.execute(studentData)).resolves.not.toThrow();

    expect(studentData.email).toBe("test@example.com");
    expect(studentData.first_name).toBe("John");
    expect(studentData.family_name).toBe("Doe");
  });
});
