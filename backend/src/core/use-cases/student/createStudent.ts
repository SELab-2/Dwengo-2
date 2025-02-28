import { useCase } from "../../../config/usecase";
import { Student } from "../../entities/student"
export class CreateStudent implements useCase<Student> {
    constructor() {}

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
        /*
            IStudent student = await studentRepository.findByEmail(input.email);
            if (student) {
                throw new Error("Email already in use");
            }
        */
        
        // Check if password is valid, how to check with hashed password?
        }

    
    async execute(input: Student): Promise<void> {
        // Business logic here
        try {
            // Normalize input
            input.first_name = input.first_name!.trim();
            input.family_name = input.family_name!.trim();

            // Check if input is valid
            await this.validateInput(input);

            // Save the student to the database
            /* 
                Student createdStudent = await studentRepository.save(input); // returns a Student but with ID.
                return createdStudent;
            */ 
        } catch (error) {
            console.error("Error creating new student:", error);
            throw error;
        }
    }
}