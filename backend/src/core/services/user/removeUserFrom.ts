import { z } from "zod";
import { removeUserFromSchema } from "./userSchemas";
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
     * @param userId - The ID of the user to be removed.
     * @param otherId - The ID of the group or class.
     * @param userType - The type of the user (student or teacher).
     */
    abstract removeUser(userId: string, otherId: string, userType: UserType): Promise<void>;

    /**
     * Removes a user from a group/class.
     *
     * @param input the parameters to remove a user from a group or class.
     * @returns empty object no extra info needed.
     */
    async execute(input: RemoveUserFromInput): Promise<object> {
        await this.removeUser(input.userId, input.otherId, input.userType);
        return {};
    }
}
