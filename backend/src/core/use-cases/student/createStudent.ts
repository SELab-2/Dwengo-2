import { useCase } from "../../../config/usecase";
import { Student } from "../../entities/student"
import {StudentRepositoryInterface} from "../../repositories/studentRepositoryInterface";
export class CreateStudent implements useCase<Student> {
    public constructor(private studentRepository: StudentRepositoryInterface) {}
    /**
     * 
     * @param input student object to be validated.
     * @returns void
     * @throws Error if input is invalid.
     */
    private async validateInput(input: Student): Promise<void> {
        // Use of general errors, specific errors to be added when interface is defined
        if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
            throw new Error("Invalid email");
        }

        if (!input.first_name || typeof input.first_name !== "string") {
            throw new Error("Invalid first name");
        }

        if (!input.family_name || typeof input.family_name !== "string") {
            throw new Error("Invalid family name");
        }

        // Check if email not already in use
        
        const present: boolean = await this.studentRepository.findByEmail(input.email);
        if (present) {
            throw new Error("Email already in use");
        }
        
    }
    
    /**
     * 
     * @param input student to be created.
     * @returns void
     * @throws Error if input is invalid.
     */
    async execute(input: Student): Promise<void> {
        try {
            // Normalize input
            input.first_name = input.first_name!.trim();
            input.family_name = input.family_name!.trim();

            // Check if input is valid
            await this.validateInput(input);

            // Save the student to the database
            const id: string = await this.studentRepository.createStudent(input);
        } catch (error) {
            console.error("Error creating new student:", error);
            throw error;
        }
    }
}