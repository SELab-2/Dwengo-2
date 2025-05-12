import { AbstractRepository } from "./abstractRepository";
import { ClassTypeORM as Class } from "../../infrastructure/database/data/data_models/classTypeorm";
import { JoinRequestType } from "../entities/joinRequest";

/**
 * Interface for a class repository.
 * This interface defines the methods required for interacting with class data.
 */
export abstract class IClassRepository extends AbstractRepository {
    /**
     * Insert a new class in the repository. The `id` field of the class should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param newClass The new class to insert.
     * @returns A promise that resolves to the inserted class.
     */
    public abstract create(newClass: Class): Promise<Class>;

    /**
     * Updates an existing class.
     * @param classId the id of the class to be updated.
     * @param updatedClass the params to be updated.
     * @returns the new version of the class.
     */
    public abstract update(classId: string, updatedClass: Partial<Class>): Promise<Class>;

    /**
     * Get a class by its id.
     * @param id The id of the class.
     * @throws EntityNotFoundError when no class is found.
     * @returns A promise that resolves to the class with the given id or null if no results are found.
     */
    public abstract getById(id: string): Promise<Class>;

    /**
     * Get a class by its name.
     * @param name The name of the class.
     * @throws EntityNotFoundError when no class is found.
     * @returns A promise that resolves to the class with the given name or null if no results are found.
     */
    public abstract getByName(name: string): Promise<Class>;

    /**
     * Get all classes in the repository.
     * @returns A promise that resolves to an array of all classes.
     */
    public abstract getAll(): Promise<Class[]>;

    /**
     * Get all classes for a user.
     * @param id the id of the user.
     * @returns A promise that resolves to an array of all classes for that user.
     * @throws {EntityNotFoundError} when the user is not found.
     */
    public abstract getByUserId(id: string): Promise<Class[]>;

    /**
     * Get all classes for a teacher.
     * @param id the id of the teacher.
     * @returns A promise that resolves to an array of all classes for that teacher.
     * @throws {EntityNotFoundError} when the teacher is not found.
     */
    public abstract getByTeacherId(id: string): Promise<Class[]>;

    /**
     * Get all classes where a student is part of.
     * @param id the id of the student.
     * @returns A promise that resolves to an array of all classes for that student.
     * @throws {EntityNotFoundError} when the student is not found.
     */
    public abstract getByStudentId(id: string): Promise<Class[]>;

    /**
     * Delete a class by its id.
     * @param id The id of the class to delete.
     * @returns A promise that resolves when the class is deleted.
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Add a student/teacher to a class.
     * @param classId id of the class.
     * @param userId id of the user to add to the class.
     * @param userType type of the user (student/teacher)
     */
    public abstract addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void>;
}
