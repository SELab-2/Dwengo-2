import { Group } from "../../../../../core/entities/group";
import { IGroupRepository } from "../../../../../core/repositories/groupRepositoryInterface";
import { DataSource } from "typeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { Student } from "../../../../../core/entities/student";
import { IDatasourceGroup } from "../datasourceGroupInterface";


export class DatasourceGroupTypeORM extends IDatasourceGroup {


    public async create(entity: Group): Promise<Group> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM);
        const classRepository = this.datasource.getRepository(ClassTypeORM);

        const groupModel = new GroupTypeORM();
        if (!entity.class_.id) {
            throw new Error("Class not found");
        }
        
        // Check if the class exists.
        const classModel : ClassTypeORM|null = await classRepository.findOne({
            where: { id: entity.class_.id },
        });

        if (!classModel){
            throw new Error("Class not found");
        }
        
        groupModel.class = classModel
        
        if (!entity.class_.id) {
            throw new Error("Class not found");
        }

        // Save the group
        const savedGroup = await groupRepository.save(groupModel);

        // Link students to the group
        const studentsOfGroup = entity.students.map(student => {
            const studentOfGroup = new StudentOfGroupTypeORM();
            studentOfGroup.student = { id: student.id } as StudentTypeORM;
            studentOfGroup.group = savedGroup;
            return studentOfGroup;
        });

        await studentOfGroupRepository.save(studentsOfGroup);

        return new Group(entity.students, entity.class_, savedGroup.id);
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

        return this.toEntity(groupModel, studentModels);
    }

    public async update(group: Group): Promise<Group> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM)

        var groupModel: GroupTypeORM | null = null;
        
        if (group.id){
            groupModel = await groupRepository.findOne({
                where: { id: group.id },
            });
        }

        if (!groupModel || groupModel === null){
            throw new Error("Group not found");
        }

        // Save updated group
        await groupRepository.save(groupModel);

        // Update students (delete old links and add new ones)
        await studentOfGroupRepository.delete({ group: groupModel });

        const studentOfGroups = group.students.map(student => {
            const studentOfGroup = new StudentOfGroupTypeORM();
            studentOfGroup.student = { id: student.id } as StudentTypeORM;
            studentOfGroup.group = groupModel as GroupTypeORM;
            return studentOfGroup;
        });

        await studentOfGroupRepository.save(studentOfGroups);

        return group;
    }

    public async delete(group: Group): Promise<void> {
        const groupRepository = this.datasource.getRepository(GroupTypeORM);
        const studentOfGroupRepository = this.datasource.getRepository(StudentOfGroupTypeORM);

        
        var groupModel: GroupTypeORM | null = null;
        
        if (group.id){
            groupModel = await groupRepository.findOne({
                where: { id: group.id },
            });
        }

        if (!groupModel || groupModel === null){
            throw new Error("Group not found");
        }

        // First, delete related student-group entries
        await studentOfGroupRepository.delete({ group: groupModel });

        // Then, delete the group itself
        await studentOfGroupRepository.delete({ group: groupModel });
    }

    // Maps the typeORM result to an entity.
    // This is here and not in groupTypeORM itself because the group entity needs data from multiple tables.
    private toEntity(groupModel: GroupTypeORM, studentModels: StudentTypeORM[]): Group{
        // Convert the student TypeORMs to Entities.
        const students: Student[] = studentModels.map((studentModel: StudentTypeORM) => studentModel.toStudentEntity(studentModel.student));
    
        return new Group(students, groupModel.class.toClassEntity(), groupModel.id,)
    }

}
