import { DatabaseEntryNotFoundError, EntityNotFoundError } from "../../config/error";
import { JoinCode } from "../../core/entities/joinCode";
import { IJoinCodeRepository } from "../../core/repositories/joinCodeRepositoryInterface";
import { DatasourceJoinCodeTypeORM } from "../database/data/data_sources/typeorm/datasourceJoinCodeTypeORM";

export class JoinCodeRepositoryTypeORM extends IJoinCodeRepository {
    private datasourceJoinCode: DatasourceJoinCodeTypeORM;

    public constructor() {
        super();
        this.datasourceJoinCode = new DatasourceJoinCodeTypeORM();
    }

    public async create(classId: string): Promise<JoinCode> {
        try {
            return await this.datasourceJoinCode.createForClass(classId);
        } catch (error: unknown) {
            if (error instanceof DatabaseEntryNotFoundError) {
                throw new EntityNotFoundError(error.message);
            } else {
                throw error;
            }
        }
    }

    public async getById(code: string): Promise<JoinCode> {
        const joinCode: JoinCode | null = await this.datasourceJoinCode.getJoinCodeById(code);

        if (joinCode) {
            return joinCode;
        } else {
            throw new EntityNotFoundError(`Join code with id ${code} not found`);
        }
    }

    public async getByClassId(classId: string): Promise<JoinCode[]> {
        return await this.datasourceJoinCode.getActiveCodeByClassId(classId);
    }

    public async setExpired(code: string): Promise<void> {
        try {
            return this.datasourceJoinCode.setExpired(code);
        } catch (error: unknown) {
            if (error instanceof DatabaseEntryNotFoundError) {
                throw new EntityNotFoundError(error.message);
            } else {
                throw error;
            }
        }
    }

    public async delete(code: string): Promise<void> {
        await this.datasourceJoinCode.delete(code);
    }
}
