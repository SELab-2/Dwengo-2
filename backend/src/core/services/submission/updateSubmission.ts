import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { updateSubmissionSchema } from "../../../application/schemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;

export class UpdateSubmission extends SubmissionBaseService<UpdateSubmissionInput> {
    constructor(
        _submissionRepository: ISubmissionRepository,
        private _userRepository: IUserRepository,
    ) {
        super(_submissionRepository);
    }
    /**
     * Executes the submission deletion process.
     * @param input - The input data for deleting a submission, validated by updateSubmissionSchema.
     * @returns An empty object.
     * @throws {ApiError} If the submission with the given id is not found.
     */
    async execute(userId: string, input: UpdateSubmissionInput): Promise<object> {
        await validateUserRights(userId, this._userRepository, UserType.TEACHER, undefined);
        await tryRepoEntityOperation(
            this.submissionRepository.update(input.id, input.status),
            "Submission",
            input.id,
            true,
        );
        return {};
    }
}
