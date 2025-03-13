import { Service, ServiceParams } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export abstract class UserBaseService<T extends ServiceParams> implements Service<T> {
    constructor(
        protected teacherRepository: ITeacherRepository,
        protected studentRepository: IStudentRepository,
    ) {}
    abstract execute(input: T): Promise<object>;
}
