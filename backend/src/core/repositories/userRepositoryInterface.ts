/*Here comes the interface for the repository for User entity -> Get's implemented in infrastructure/repositories*/

import { AbstractRepository } from "./abstractRepository";
import { User } from "../entities/user";
import { Student } from "../entities/student";
import { Teacher } from "../entities/teacher";

export abstract class IUserRepository extends AbstractRepository {
    /**
     * Insert a new user in the repository. The `id` field of the user should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param user The new user to insert.
     * @returns A promise that resolves to the inserted user.
     */
    public abstract create(user: User): Promise<User>;

    /**
     * Get a user by its id. Throws an `EntityNotFoundError` when no user is found.
     * @param id The id of the user
     * @returns A promise that resolves to the user with the given id or null if no results are found.
     */
    public abstract getById(id: string): Promise<User>;

    /**
     * Get a user by their email. Throws an `EntityNotFoundError` when no user is found.
     * @param email The email of the user
     * @returns A promise that resolves to the user with the given email or null if no results are found.
     */
    public abstract getByEmail(email: string): Promise<User>;

    /**
     * Get a user by their first name. Throws an `EntityNotFoundError` when no user is found.
     * @param first_name The first name of the user
     * @returns A promise that resolves to the user with the given first name.
     */
    public abstract getByFirstName(first_name: string): Promise<User>;

    /**
     * Get a user by their last name. Throws an `EntityNotFoundError` when no user is found.
     * @param last_name The last name of the user
     * @returns A promise that resolves to the user with the given last name.
     */
    public abstract getByLastName(last_name: string): Promise<User>;

    /**
     * Get all students in the repository.
     * @returns A promise that resolves to an array of all students.
     */
    public abstract getAllStudents(): Promise<Student[]>;

    /**
     * Get all teachers in the repository.
     * @returns A promise that resolves to an array of all teachers.
     */
    public abstract getAllTeachers(): Promise<Teacher[]>;

    /**
     * Update an existing user in the repository.
     * @param user The user to update.
     * @returns A promise that resolves to the updated user.
     */
    public abstract update(user: User): Promise<User>;

    /**
     * Delete a user from the repository.
     * @param id The id of the user to delete.
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Function to remove a user from a class.
     *
     * @param userId ID of user to be removed from class
     * @param classId ID of class from which user is to be removed
     * @returns void
     *
     * @throws Error if user is not in class
     * @throws Error if class does not exist
     */
    public abstract removeFromClass(userId: string, classId: string): Promise<void>;

    /**
     * Function to remove a student from a group.
     *
     * @param userId ID of student to be removed from group
     * @param groupId ID of group from which user is to be removed
     * @returns void
     *
     * @throws Error if student is not in group
     * @throws Error if group does not exist
     */
    public abstract removeFromGroup(studentId: string, groupId: string): Promise<void>;

    /**
     * Check if a user is present in the DB.
     * @param email email of the user to be found
     * @returns true if the user is present in the DB, false otherwise.
     */
    public abstract checkByEmail(email: string): Promise<boolean>;

    /**
     * Assign a student to a group within an assignment. If the assignment is individual,
     * the user will be assigned to a group of 1.
     * @param userId the student to be assigned.
     * @param groupId the group in the assignment where the user is part of.
     * @throws {EntityNotFoundError} when the student or group could not be found.
     */
    public abstract assignToGroup(studentId: string, groupId: string): Promise<void>;

    /**
     * Get all students for a class
     * @param classId
     * @returns the id of the students
     * @throws {EntityNotFoundError} when the assignment could not be found.
     */
    public abstract getStudentsByClassId(classId: string): Promise<Student[]>;

    /**
     * Get all teachers for a class
     * @param classId
     * @returns the id of the teachers
     * @throws {EntityNotFoundError} when the assignment could not be found.
     */
    public abstract getTeachersByClassId(classId: string): Promise<Teacher[]>;

    /**
     * Get all users for an assignment.
     * @param assignmentId
     * @returns the id of the users
     * @throws {EntityNotFoundError} when the assignment could not be found.
     */
    public abstract getByAssignmentId(assignmentId: string): Promise<User[]>;

    /**
     * Get all users for a group.
     * @param groupId
     * @returns the id of the users
     * @throws {EntityNotFoundError} when the group could not be found.
     */
    public abstract getByGroupId(groupId: string): Promise<User[]>;
}
