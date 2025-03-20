import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { deleteClassSchema } from "./classSchemas";

type DeleteClassInput = z.infer<typeof deleteClassSchema>;

export class DeleteClass extends ClassBaseService<DeleteClassInput> {
    async execute(input: DeleteClassInput): Promise<object> {
        await this.classRepository.deleteClassById(input.id);
        return {};
    }
}
