import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { DeleteUser } from "../user/deleteUser";

export class DeleteStudent extends DeleteUser {
  constructor(private studentRepository: IStudentRepository) {super()}
  async deleteStudent(id: string): Promise<void> {
    await this.studentRepository.deleteStudentById(id);
  }
}