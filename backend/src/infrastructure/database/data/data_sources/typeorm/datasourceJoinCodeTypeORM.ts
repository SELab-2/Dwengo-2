import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";

export class DatasourceJoinCodeTypeORM extends DatasourceTypeORM {
    public async getActiveCodeByClassId(classId: string): Promise<string | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Find an active join code for the class
        const joinCodeModel: JoinCodeTypeORM | null = await datasource
            .getRepository(JoinCodeTypeORM)
            .findOne({ where: { class: { id: classId }, isExpired: false } });

        if (joinCodeModel !== null) {
            return joinCodeModel.code;
        }
        // There are no active codes
        return null; // No result
    }

    /*
    Creates a new join code for a class and returns the code that was created as an alphanumerical string of length 6
    */
    public async createForClass(classId: string): Promise<string> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Find the relevant class
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: classId } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Create a new join code
        const joinCodeModel: JoinCodeTypeORM = datasource.getRepository(JoinCodeTypeORM).create({
            class: classModel,
            isExpired: false,
        });

        // Return the code, which is the id of the join code model
        return joinCodeModel.code;
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
            throw new EntityNotFoundError(`Join code ${code} not found`);
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
