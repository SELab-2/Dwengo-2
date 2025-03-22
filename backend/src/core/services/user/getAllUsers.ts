import { UserBaseService } from "./userBaseService";
import { ServiceParams } from "../../../config/service";

export class GetAllUsersParams implements ServiceParams {
    public constructor() {} //needed for controller
}

export class GetAllUsers extends UserBaseService<GetAllUsersParams> {
    async execute(): Promise<object> {
        const students = (await this.studentRepository.getAll()).map(student => student.toObject());
        const teachers = (await this.teacherRepository.getAllTeachers()).map(teacher => teacher.toObject());

        return { students: students, teachers: teachers };
    }
}
