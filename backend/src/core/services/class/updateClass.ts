import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { updateClassSchema } from "./classSchemas";
import { Class } from "../../entities/class";

type UpdateClassInput = z.infer<typeof updateClassSchema>;

export class UpdateClass extends ClassBaseService<UpdateClassInput> {
    async execute(input: UpdateClassInput): Promise<object> {
        // Object met alleen de velden die worden bijgewerkt
        const updatedFields: Partial<Class> = {};
        if (input.name) updatedFields.name = input.name;
        if (input.description) updatedFields.description = input.description;
        if (input.targetAudience) updatedFields.targetAudience = input.targetAudience;

        return (await this.classRepository.updateClass(input.id, updatedFields)).toObject();
    }
}
