import { UseCase } from "../../../config/usecase";
import { Student } from "../../entities/student"
import { StudentRepositoryInterface } from "../../repositories/studentRepositoryInterface";
import { AppError, EntityNotFoundError } from "../../../config/error";
export class CreateStudent implements UseCase<Student, string> {
    public constructor(private studentRepository: StudentRepositoryInterface) {}
    /**
     * Validates student input.
     * @param input student object to be validated.
     * @returns void
     * @throws AppError if input is invalid.
     */
    private async validateInput(input: Student): Promise<void> {
        // Use of general errors, specific errors to be added when interface is defined
        if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
            throw new AppError("Invalid email", 400);
        }

        // Check if email not already in use
        let present: boolean = true;
        try{
            await this.studentRepository.getStudentByEmail(input.email);
        }catch(e){
            if (e instanceof EntityNotFoundError) {
                present = false;
            }else{
                console.log(e);
            }
        }
        if (present) {
            throw new AppError("Email already in use", 409);
        }
        
    }
    
    /**
     * Creates a new student.
     * @param input student to be created.
     * @returns void
     * @throws AppError if input is invalid.
     */
    async execute(input: Student): Promise<string> {
        // Normalize input
        input.firstName = input.firstName!.trim();
        input.familyName = input.familyName!.trim();

        // Check if input is valid
        await this.validateInput(input);

        // Save the student to the database
        const student: Student = await this.studentRepository.createStudent(input);

        return student.id as string;
    }
}