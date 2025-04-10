import { app } from "../../src/app"
import request from "supertest"
import bcript from "bcryptjs"
import { AuthDetails, initializeUser } from "./helpers";

describe("Test user API endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;

    beforeEach(async () => {
        studentAuthDetails = await initializeUser("student", app);
        teacherAuthDetails = await initializeUser("teacher", app, "teacher@gmail.com");
    });

    describe("GET", () => {
        let classId: string;
        let assignmentId: string;
        let groupId: string;

        beforeEach(async () => {
            const classResponse = await request(app)
                .post("/classes")
                .send({
                    "name": "class_123",
                    "description": "string",
                    "targetAudience": "string",
                    "teacherId": teacherAuthDetails.id
                })
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            classId = classResponse.body.id;

            const joinRequestResponse = await request(app)
                .post("/requests")
                .send({
                    "requester": studentAuthDetails.id,
                    "class": classId,
                    "userType": "student"    
                })
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);

            await request(app)
                .patch("/requests/" + joinRequestResponse.body.id)
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            const assignmentResponse = await request(app)
                .post("/assignments")
                .send({
                    "classId": classId,
                    "learningPathId": "string",
                    "startDate": "2025-04-10",
                    "deadline": "2025-04-10",
                    "extraInstructions": "extra_instructions"
                })
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            assignmentId = assignmentResponse.body.id;

            const groupResponse = await request(app)
                .post("/groups")
                .send({
                    "assignment": assignmentId,
                    "members": [studentAuthDetails.id]
                })
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);
            
            groupId = groupResponse.body.id;
        });

        describe("/user/{studentId}", () => {
            it("should return a student with status 200", async () => {
                const response = await request(app)
                    .get("/users/" + studentAuthDetails.id + "?userType=student")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token)

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": studentAuthDetails.id,
                    "email": "jan12@gmail.com",
                    "firstName": "Jan",
                    "familyName": "De nul",
                    "passwordHash": expect.any(String),
                    "schoolName": "Yale"
                });
                expect(await bcript.compare(studentAuthDetails.password, response.body.passwordHash)).toBe(true);
            });
        });

        describe("/user/{teacherId}", () => {
            it("should return a teacher with status 200", async () => {
                const response = await request(app)
                    .get("/users/" + teacherAuthDetails.id + "?userType=teacher")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token)

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": teacherAuthDetails.id,
                    "email": "teacher@gmail.com",
                    "firstName": "Jan",
                    "familyName": "De nul",
                    "passwordHash": expect.any(String),
                    "schoolName": "Yale"
                });
                expect(await bcript.compare(teacherAuthDetails.password, response.body.passwordHash)).toBe(true);
            });
        });

        describe("/classes/{idParent}/users", () => {
            let classId: string;

            beforeEach(async () => {
                const classResponse = await request(app)
                    .post("/classes")
                    .send({
                        "name": "class_123",
                        "description": "string",
                        "targetAudience": "string",
                        "teacherId": teacherAuthDetails.id
                    })
                    .set("Content-Type", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);

                classId = classResponse.body.id;

                const joinRequestResponse = await request(app)
                    .post("/requests")
                    .send({
                        "requester": studentAuthDetails.id,
                        "class": classId,
                        "userType": "student"    
                    })
                    .set("Content-Type", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                await request(app)
                    .patch("/requests/" + joinRequestResponse.body.id)
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
            });

            it("should return a list of users in a class with status 200", async () => {
                const response = await request(app)
                    .get("/classes/" + classId + "/users")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "students": [studentAuthDetails.id],
                    "teachers": [teacherAuthDetails.id]
                });
            });
        });

        describe("/assignments/{idParent}/users", () => {
            it("should return a list of users of an assignment with status 200", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId + "/users")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "students": [studentAuthDetails.id]
                });
            });
        });

        describe("/groups/{idParent}/users", () => {
            it("should return a list of users of a group with status 200", async () => {
                const response = await request(app)
                    .get("/groups/" + groupId + "/users")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "students": [studentAuthDetails.id]
                });
            });
        });
    });    
});