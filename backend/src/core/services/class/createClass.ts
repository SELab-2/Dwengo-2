import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { createClassSchema } from "../../../application/schemas/classSchemas";
import { Class } from "../../entities/class";

export type CreateClassInput = z.infer<typeof createClassSchema>;

export class CreateClass extends ClassBaseService<CreateClassInput> {
    async execute(input: CreateClassInput): Promise<object> {
        const newClass = new Class(input.name, input.description, input.targetAudience, input.teacherId);
        return { id: (await this.classRepository.create(newClass)).id };
    }
}
