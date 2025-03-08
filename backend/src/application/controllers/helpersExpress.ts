import { Request } from "../types"

export function defaultExtractor(req: Request): object {
    return req.body;
}