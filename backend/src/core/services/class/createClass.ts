import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { Class } from "../../entities/class";
import { createClassSchema } from "./classSchemas";

type CreateClassInput = z.infer<typeof createClassSchema>;

export class CreateClass extends ClassBaseService<CreateClassInput> {
    async execute(input: CreateClassInput): Promise<object> {
        const newClass = new Class(input.name, input.description, input.targetAudience, input.teacherId);
        return { id: (await this.classRepository.createClass(newClass)).id };
    }
}
