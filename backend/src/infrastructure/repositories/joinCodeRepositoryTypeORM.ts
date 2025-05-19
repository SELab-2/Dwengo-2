import { JoinCode } from "../../core/entities/joinCode";
import { IJoinCodeRepository } from "../../core/repositories/joinCodeRepositoryInterface";
import { DatasourceJoinCodeTypeORM } from "../database/data/data_sources/typeorm/datasourceJoinCodeTypeORM";

export class JoinCodeRepositoryTypeORM extends IJoinCodeRepository {
    private datasourceJoinCode: DatasourceJoinCodeTypeORM;

    public constructor() {
        super();
        this.datasourceJoinCode = new DatasourceJoinCodeTypeORM();
    }

    public async create(joinCode: JoinCode): Promise<JoinCode> {
        return await this.datasourceJoinCode.create(joinCode);
    }

    public async getById(code: string): Promise<JoinCode> {
        return await this.datasourceJoinCode.getById(code);
    }

    public async getByClassId(classId: string): Promise<JoinCode[]> {
        return await this.datasourceJoinCode.getByClassId(classId);
    }

    public async update(joinCode: JoinCode): Promise<JoinCode> {
        return await this.datasourceJoinCode.update(joinCode);
    }

    public async delete(code: string): Promise<void> {
        await this.datasourceJoinCode.delete(code);
    }
}
