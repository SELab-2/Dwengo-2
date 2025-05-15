import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Group } from "../../../../../core/entities/group";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceGroupTypeORM extends DatasourceTypeORM {
    public async create(entity: Group): Promise<Group> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupRepository = datasource.getRepository(GroupTypeORM);
        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);

        const groupModel = new GroupTypeORM();
        if (!entity.assignmentId) {
            throw new Error("No assignment id was provided.");
        }

        // Link the group to the assignment
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository.findOne({
            where: { id: entity.assignmentId },
        });
        if (!assignmentModel) {
            throw new Error(`Assignment with id ${entity.assignmentId} not found`);
        }
        groupModel.assignment = assignmentModel;

        // Link students to the group
        groupModel.students = entity.memberIds.map(memberId => {
            return { id: memberId } as UserTypeORM;
        });

        // Save the group
        const savedGroup = await groupRepository.save(groupModel);

        return new Group(entity.memberIds, entity.assignmentId, savedGroup.id);
    }

    public async getById(id: string): Promise<Group> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // Fetch the group model
        const groupModel: GroupTypeORM | null = await datasource.getRepository(GroupTypeORM).findOne({
            where: { id: id },
            relations: ["assignment", "students"],
        });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id ${id} not found`);
        }

        return groupModel.toEntity();
    }

    public async update(group: Group): Promise<Group> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupRepository = datasource.getRepository(GroupTypeORM);

        let groupModel: GroupTypeORM | null = null;

        if (group.id) {
            groupModel = await groupRepository.findOne({
                where: { id: group.id },
            });
        }

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id: ${group.id} not found`);
        }

        groupModel.students = group.memberIds.map(memberId => {
            return { id: memberId } as UserTypeORM;
        });

        // Save updated group
        await groupRepository.save(groupModel);

        return group;
    }

    public async delete(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupModel: GroupTypeORM | null = await datasource
            .getRepository(GroupTypeORM)
            .findOne({ where: { id: id } });

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id: ${id} not found`);
        }

        await datasource.getRepository(GroupTypeORM).delete(groupModel.id);
    }

    //SHOW: Before edit: this method was brainless copy pasting of chatGPT. Pain in the ass bug
    /**public async delete(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupRepository = datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = datasource.getRepository(StudentOfGroupTypeORM);

        let groupModel: GroupTypeORM | null = null;

        if (id) {
            groupModel = await groupRepository.findOne({
                where: { id: id },
            });
        }

        if (!groupModel) {
            throw new EntityNotFoundError(`Group with id: ${id} not found`);
        }

        // First, delete related student-group entries
        await studentOfGroupRepository.delete({ group: groupModel });

        // Then, delete the group itself
        await studentOfGroupRepository.delete({ group: groupModel });
    }*/

    public async getByUserId(userId: string): Promise<Group[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupRepository = datasource.getRepository(GroupTypeORM);
    
        const groupModels: GroupTypeORM[] = await groupRepository.find({
            where: {
                students: {
                    id: userId
                }
            },
            relations: ['students', 'assignment']
        });

        return groupModels.map(model => model.toEntity());
    }

    public async getByAssignmentId(assignmentId: string): Promise<Group[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const groupRepository = datasource.getRepository(GroupTypeORM);
    
        const groupModels: GroupTypeORM[] = await groupRepository.find({
            where: {
                assignment: {
                    id: assignmentId
                }
            },
            relations: ['students', 'assignment']
        });

        return groupModels.map(model => model.toEntity());
    }
}
