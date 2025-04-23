import { mock } from "node:test";
import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";
import request from "supertest";


describe("Test assignment API Endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let classId: string;
    let mockAssignment: object;

    beforeEach(async () => {
        studentAuthDetails = await initializeUser("student", app);
        teacherAuthDetails = await initializeUser("teacher", app, "teacher@gmail.com");

        const classReponse = await request(app)
            .post("/classes")
            .send({
                "name": "class_123",
                "description": "string",
                "targetAudience": "string",
                "teacherId": teacherAuthDetails.id
            })
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer " + teacherAuthDetails.token);
        
        classId = classReponse.body.id;

        mockAssignment = {
            "classId": classId,
            "learningPathId": "string",
            "startDate": "2025-04-10",
            "deadline": "2025-04-10",
            "name": "name",
            "extraInstructions": "extra_instructions"
          }
    });

    describe("POST /assignments", () => {
        it("should create an assignment with status 201", async () => {
            const response = await request(app)
                .post("/assignments")
                .send(mockAssignment)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);
            
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String),
            });
        });
    });

    describe("GET", () => {
        let assignmentId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/assignments")
                .send(mockAssignment)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            assignmentId = response.body.id;
        });

        describe("/assignments/{id}", () => {
            it("should return an assignment with status 200", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": assignmentId,
                    ...mockAssignment
                });
            });
        });

        describe("/users/{idParent}/assignment", () => {
            beforeEach(async () => {
                await request(app)
                    .post("/groups")
                    .send({
                        "assignment": assignmentId,
                        "members": [studentAuthDetails.id]
                    })
                    .set("Content-Type", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
            });

            it("should return a list of assignments of user with status 200", async () => {
                const response = await request(app)
                    .get("/users/" + studentAuthDetails.id + "/assignments")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "assignments": [assignmentId]
                });
            });
        });
    });

    describe("PATCH /assignment/{id}", () => {
        let updatedAssignment: object;
        let newDate: string;
        let assignmentId: string;

        beforeEach(async () => {
            const assignmentResponse = await request(app)
                .post("/assignments")
                .send(mockAssignment)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            assignmentId = assignmentResponse.body.id;
            newDate = new Date("2031-12-12").toISOString().split("T")[0];
            updatedAssignment = {
                "deadline": newDate
            }
        });

        it("should update an assignment with status 204", async () => {
            const response = await request(app)
                .patch("/assignments/" + assignmentId)
                .send(updatedAssignment)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});

            const checkResponse = await request(app)
                .get("/assignments/" + assignmentId)
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(checkResponse.status).toBe(200);
            expect(checkResponse.body).toEqual({
                "id": assignmentId,
                "classId": classId,
                "learningPathId": "string",
                "startDate": "2025-04-10",
                "deadline": newDate,
                "name": "name",
                "extraInstructions": "extra_instructions"
            });
        });
    })
});