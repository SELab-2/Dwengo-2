import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Teacher } from "../entities/teacher";

export abstract class ITeacherRepository {

    public constructor(
        protected datasourceFactory: IDatasourceFactory
    ) {}

    // TODO: crud operations

    // create
    public abstract createTeacher(teacher: Teacher): Promise<Teacher>;

    // retrieve
    public abstract getTeacherById(id: string): Promise<Teacher>;

    public abstract getTeacherByEmail(email: string): Promise<Teacher>;

    public abstract getTeacherByFirstName(first_name: string): Promise<Teacher>;

    public abstract getTeacherByLastName(last_name: string): Promise<Teacher>;

    /*

    getTeacherByPredicate(predicate: (teacher: Teacher) => boolean): Promise<Teacher>; ??

    */

    public abstract getAllTeachers(): Promise<Teacher[]>;

    // update
    public abstract updateTeacher(teacher: Teacher): Promise<Teacher>;

    // delete
    public abstract deleteTeacher(teacher: Teacher): Promise<Teacher>;

}
