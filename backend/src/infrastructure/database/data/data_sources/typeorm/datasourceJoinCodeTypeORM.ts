import { DatasourceTypeORM } from "./datasourceTypeORM";
import { DatabaseEntryNotFoundError } from "../../../../../config/error";
import { JoinCode } from "../../../../../core/entities/joinCode";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";

export class DatasourceJoinCodeTypeORM extends DatasourceTypeORM {
    /*
    Creates a new join code for a class and returns the code that was created as an alphanumerical string of length 6
    */
    public async createForClass(classId: string): Promise<JoinCode> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Find the relevant class
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: classId } });

        if (!classModel) {
            throw new DatabaseEntryNotFoundError(`Class with id ${classId} not found`);
        }

        // Create a new join code
        const joinCodeModel: JoinCodeTypeORM = datasource.getRepository(JoinCodeTypeORM).create({
            class: classModel,
            isExpired: false,
        });
        await datasource.getRepository(JoinCodeTypeORM).save(joinCodeModel);

        return joinCodeModel.toJoinCodeEntity();
    }

    public async getJoinCodeById(code: string): Promise<JoinCode | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinCode: JoinCodeTypeORM | null = await datasource.getRepository(JoinCodeTypeORM).findOne({
            where: { code: code },
            relations: ["class"],
        });

        return joinCode ? joinCode.toJoinCodeEntity() : null;
    }

    public async getActiveCodeByClassId(classId: string): Promise<JoinCode[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinCodes: JoinCodeTypeORM[] = await datasource.getRepository(JoinCodeTypeORM).find({
            where: { class: { id: classId }, isExpired: false },
            relations: ["class"],
        });

        return joinCodes.map(joinCode => joinCode.toJoinCodeEntity());
    }

    /*
    Marks the join code as being expired. No one can use expired codes to join a class
    */
    public async setExpired(code: string) {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const joinCodeRepository = datasource.getRepository(JoinCodeTypeORM);

        // Find the code
        const joinCodeModel: JoinCodeTypeORM | null = await joinCodeRepository.findOne({ where: { code: code } });

        if (!joinCodeModel) {
            throw new DatabaseEntryNotFoundError(`Join code ${code} not found`);
        }

        // Set expired to true
        joinCodeModel.isExpired = true;

        // Update the database
        await joinCodeRepository.update(code, joinCodeModel);
    }

    public async delete(code: string) {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(JoinCodeTypeORM).delete(code);
    }
}
