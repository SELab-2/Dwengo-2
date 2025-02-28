import { Teacher } from "../../../../core/entities/teacher";

export interface IDatasource {

    createTeacher(teacher: Teacher): Promise<Teacher>;

}
