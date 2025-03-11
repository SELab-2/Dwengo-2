import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { DeleteUser } from "../user/deleteUser";

export class DeleteTeacher extends DeleteUser {
  constructor(private teacherRepository: ITeacherRepository) {super()}
  async deleteStudent(id: string): Promise<void> {
    await this.teacherRepository.deleteTeacherWithId(id);
  }
}