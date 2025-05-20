import { z } from "zod";
import { removeUserFromSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type RemoveUserFromInput = z.infer<typeof removeUserFromSchema>;

/**
 * @description Abstract class for removing a user from a group or class.
 */
export abstract class RemoveUserFrom implements Service<RemoveUserFromInput> {
    public constructor() {}

    /** Function that calls the appropriate method of the repository.
     *
     * @param id - The ID of the user to be removed.
     * @param idParent - The ID of the group or class.
     */
    abstract removeUser(id: string, idParent: string): Promise<void>;

    /**
     * Executes the remove use from process.
     * @param input - The input data for deleting a collection user, validated by removeUserFromSchema.
     * @returns An empty object.
     * @throws {ApiError} If the collection or user with the given id is not found.
     */
    async execute(userId: string, input: RemoveUserFromInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        await tryRepoEntityOperation(
            this.removeUser(input.id, input.idParent),
            "User | Collection",
            `${input.id} | ${input.idParent}`,
        );
        return {};
    }
}
