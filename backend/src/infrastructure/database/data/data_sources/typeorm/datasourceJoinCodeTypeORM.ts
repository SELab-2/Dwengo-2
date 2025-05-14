import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { JoinCode } from "../../../../../core/entities/joinCode";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";

export class DatasourceJoinCodeTypeORM extends DatasourceTypeORM {
    public async create(joinCode: JoinCode): Promise<JoinCode> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classRepository = datasource.getRepository(ClassTypeORM);
        const joinCodeRepository = datasource.getRepository(JoinCodeTypeORM);

        // Find the relevant class
        const classModel = await classRepository.findOne({ where: { id: joinCode.classId } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${joinCode.classId} not found`);
        }

        // Create a new join code
        const joinCodeModel = JoinCodeTypeORM.createTypeORM(joinCode, classModel);

        const savedJoinCodeModel = await joinCodeRepository.save(joinCodeModel);

        return savedJoinCodeModel.toEntity();
    }

    public async getById(code: string): Promise<JoinCode> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinCodeRepository = datasource.getRepository(JoinCodeTypeORM);
        const joinCodeModel: JoinCodeTypeORM | null = await joinCodeRepository.findOne({
            where: { code: code },
            relations: ["class"],
        });

        if (!joinCodeModel) {
            throw new EntityNotFoundError(`JoinCode with code ${code} not found`);
        }

        const joinCode: JoinCode = joinCodeModel.toEntity();
        return joinCode;
    }

    public async update(joinCode: JoinCode): Promise<JoinCode> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinCodeRepository = datasource.getRepository(JoinCodeTypeORM);
        const joinCodeModel: JoinCodeTypeORM | null = await joinCodeRepository.findOne({
            where: { code: joinCode.code },
            relations: ["class"],
        });

        if (!joinCodeModel) {
            throw new EntityNotFoundError(`JoinCode with code ${joinCode.code} not found`);
        }

        const updatedJoinCode = JoinCodeTypeORM.createTypeORM(joinCode, joinCodeModel.class);
        updatedJoinCode.class = joinCodeModel.class;

        joinCodeRepository.delete(joinCodeModel.code);
        joinCodeRepository.save(updatedJoinCode);

        return updatedJoinCode.toEntity();
    }

    public async delete(code: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        await datasource.getRepository(JoinCodeTypeORM).delete(code);
    }

    public async getByClassId(classId: string): Promise<JoinCode[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classRepository = datasource.getRepository(ClassTypeORM);
        const joinCodeRepository = datasource.getRepository(JoinCodeTypeORM);

        const classModel = await classRepository.findOne({ where: { id: classId } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        const joinCodes = await joinCodeRepository.find({
            where: { class: classModel },
            relations: ["class"],
        });

        return joinCodes.map(model => model.toEntity());
    }
}
