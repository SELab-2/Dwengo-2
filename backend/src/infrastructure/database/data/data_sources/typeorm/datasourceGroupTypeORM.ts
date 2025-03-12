import { Group } from "../../../../../core/entities/group";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { IDatasourceGroup } from "../datasourceGroupInterface";
import { EntityNotFoundError } from "../../../../../config/error";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";

export class DatasourceGroupTypeORM extends IDatasourceGroup {

    public async create(entity: Group): Promise<Group> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM);
        const assignmentRepository = this.datasource.getRepository(AssignmentTypeORM);

        const groupModel = new GroupTypeORM();
        if (!entity.assignmentId) {
            throw new Error("No assignment id was provided.");
        }
        
        // Link the group to the assignment
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository.findOne({ where: { id: entity.assignmentId } });
        if(!assignmentModel) {
            throw new Error(`Assignment with id ${entity.assignmentId} not found`);
        }
        groupModel.assignment = assignmentModel;
        
        // Save the group
        const savedGroup = await groupRepository.save(groupModel);

        // Link students to the group
        const studentsOfGroup = entity.memberIds.map(memberId => {
            const studentOfGroup = new StudentOfGroupTypeORM();
            studentOfGroup.student = { id: memberId } as StudentTypeORM;
            studentOfGroup.group = savedGroup;
            return studentOfGroup;
        });

        await studentOfGroupRepository.save(studentsOfGroup);

        return new Group(entity.memberIds, entity.assignmentId, savedGroup.id);
    }

    public async getById(id: string): Promise<Group|null> {
        // Fetch the group model
        const groupModel : GroupTypeORM|null = await this.datasource.getRepository(GroupTypeORM).findOne({
            where: { id: id },
        });

        if (!groupModel) {
            return null
        }

        // Fetch all students in that group
        const studentOfGroups : StudentOfGroupTypeORM[] = await this.datasource
            .getRepository(StudentOfGroupTypeORM)
            .find({
                where: { group: groupModel },
                relations: ["student", "student.student"], // student.student fetches UserTypeORM
            }
        );

        // Extract StudentTypeORM models
        const studentModels : StudentTypeORM[] = studentOfGroups.map(entry => entry.student);

        return groupModel.toEntity(studentModels);
    }

    public async update(group: Group): Promise<Group> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM)

        let groupModel: GroupTypeORM | null = null;
        
        if (group.id){
            groupModel = await groupRepository.findOne({
                where: { id: group.id },
            });
        }

        if (!groupModel){
            throw new EntityNotFoundError(`Group with id: ${group.id} not found`);
        }

        // Save updated group
        await groupRepository.save(groupModel);

        // Update students (delete old links and add new ones)
        await studentOfGroupRepository.delete({ group: groupModel });

        const studentOfGroups = group.memberIds.map(memberId => {
            const studentOfGroup = new StudentOfGroupTypeORM();
            studentOfGroup.student = { id: memberId } as StudentTypeORM;
            studentOfGroup.group = groupModel as GroupTypeORM;
            return studentOfGroup;
        });

        await studentOfGroupRepository.save(studentOfGroups);

        return group;
    }

    public async delete(id: string): Promise<void> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM);

        
        let groupModel: GroupTypeORM | null = null;
        
        if (id){
            groupModel = await groupRepository.findOne({
                where: { id: id },
            });
        }

        if (!groupModel){
            throw new EntityNotFoundError(`Group with id: ${id} not found`);
        }

        // First, delete related student-group entries
        await studentOfGroupRepository.delete({ group: groupModel });

        // Then, delete the group itself
        await studentOfGroupRepository.delete({ group: groupModel });
    }


}
