import { z } from "zod";
import { removeUserFromSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";

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
     * @param userType - The type of the user (student or teacher).
     */
    abstract removeUser(id: string, idParent: string, userType: UserType): Promise<void>;

    /**
     * Removes a user from a group/class.
     *
     * @param input the parameters to remove a user from a group or class.
     * @returns empty object no extra info needed.
     */
    async execute(input: RemoveUserFromInput): Promise<object> {
        await this.removeUser(input.id, input.idParent, input.userType);
        return {};
    }
}
