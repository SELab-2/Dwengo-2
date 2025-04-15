import { z } from "zod";

export const getUserProgressSchema = z.object({
    idParent: z.string(),
    id: z.string(),
});