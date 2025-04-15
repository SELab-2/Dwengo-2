import { IJoinCodeRepository } from "../../core/repositories/joinCodeRepositoryInterface";
import { DatasourceJoinCodeTypeORM } from "../database/data/data_sources/typeorm/datasourceJoinCodeTypeORM";

export class JoinCodeRepositoryTypeORM extends IJoinCodeRepository {
    private datasourceJoinCode: DatasourceJoinCodeTypeORM;

    public constructor() {
        super();
        this.datasourceJoinCode = new DatasourceJoinCodeTypeORM();
    }

    public async getByClassId(classId: string): Promise<string> {
        const code: string | null = await this.datasourceJoinCode.getActiveCodeByClassId(classId);
        if (code) {
            return code!;
        }
        return await this.datasourceJoinCode.createForClass(classId);
    }

    public async setExpired(code: string): Promise<void> {
        return this.datasourceJoinCode.setExpired(code);
    }
}
