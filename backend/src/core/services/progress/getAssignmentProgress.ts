import { GetProgress } from "./getProgress";
import { User } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";

export class GetAssignmentProgress extends GetProgress {
    public async getUsers(id: string): Promise<User[]> {
        return await tryRepoEntityOperation(this.studentRepository.getByAssignmentId(id), "Assignment", id, true);
    }
}
