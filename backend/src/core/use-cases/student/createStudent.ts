import { UseCase } from "../../../config/useCase";
import { Student } from "../../entities/student"
import {IStudentRepository} from "../../repositories/studentRepositoryInterface";
export class CreateStudent implements UseCase<Student, string> {
    public constructor(private studentRepository: IStudentRepository) {}
    /**
     * Validates student input.
     * @param input student object to be validated.
     * @returns void
     * @throws Error if input is invalid.
     */
    private async validateInput(input: Student): Promise<void> {
        // Use of general errors, specific errors to be added when interface is defined
        if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
            throw new Error("Invalid email");
        }

        if (!input.firstName || typeof input.firstName !== "string") {
            throw new Error("Invalid first name");
        }

        if (!input.familyName || typeof input.familyName !== "string") {
            throw new Error("Invalid family name");
        }

        // Check if email not already in use
        
        const present: boolean = await this.studentRepository.findByEmail(input.email);
        if (present) {
            throw new Error("Email already in use");
        }
        
    }
    
    /**
     * Creates a new student.
     * @param input student to be created.
     * @returns void
     * @throws Error if input is invalid.
     */
    async execute(input: Student): Promise<string> {
        try {
            // Normalize input
            input.firstName = input.firstName!.trim();
            input.familyName = input.familyName!.trim();

            // Check if input is valid
            await this.validateInput(input);

            // Save the student to the database
            const id: string = await this.studentRepository.createStudent(input);
            return id;
        } catch (error) {
            console.error("Error creating new student:", error);
            throw error;
        }
    }
}