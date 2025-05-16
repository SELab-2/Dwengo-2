import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";
import request from "supertest";


describe("Test task API Endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let assignmentId: string;
    let mockNormalQuestion: object;
    let mockMultipleChoice: object;

    beforeEach(async () => {
        studentAuthDetails = await initializeUser("student", app);
        teacherAuthDetails = await initializeUser("teacher", app, "teacher@gmail.com");

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

        const classId = classResponse.body.id;

        const mockAssignment = {
            "classId": classId,
            "learningPathId": "string",
            "startDate": "2025-04-10",
            "deadline": "2025-04-10",
            "name": "name",
            "extraInstructions": "extra_instructions"
        }

        const taskResponse = await request(app)
            .post("/assignments")
            .send(mockAssignment)
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer " + teacherAuthDetails.token);

        assignmentId = taskResponse.body.id;

        mockNormalQuestion = {
            "assignmentId": assignmentId,
            "step": 1,
            "question": "test_question",
            "type": "NORMALQUESTION",
            "details": {
                "predefined_answer": "test_answer"
            }
        }

        mockMultipleChoice = {
            "assignmentId": assignmentId,
            "step": 1,
            "question": "test_question",
            "type": "NORMALQUESTION",
            "details": {
                "options": ["option1", "option2"],
                "correctAnswers": [1]
            }
        }
    });

    describe("POST /tasks", () => {
        it("should create a task with status 201", async () => {
            const response = await request(app)
                .post("/tasks")
                .send(mockNormalQuestion)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String),
            });

            const response2 = await request(app)
                .post("/tasks")
                .send(mockMultipleChoice)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response2.status).toBe(201);
            expect(response2.body).toEqual({
                "id": expect.any(String),
            });
        });
    });

    describe("GET", () => {
        let normalQuestionId: string;
        let multipleChoiceId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/tasks")
                .send(mockNormalQuestion)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            const response2 = await request(app)
                .post("/tasks")
                .send(mockMultipleChoice)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            normalQuestionId = response.body.id;
            multipleChoiceId = response2.body.id;
        });

        describe("/tasks/{id}", () => {
            it("should return a task with status 200 (student)", async () => {
                const response = await request(app)
                    .get("/tasks/" + normalQuestionId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": normalQuestionId,
                    ...mockNormalQuestion
                });

                const response2 = await request(app)
                    .get("/tasks/" + multipleChoiceId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response2.status).toBe(200);
                expect(response2.body).toEqual({
                    "id": multipleChoiceId,
                    ...mockMultipleChoice
                });
            });
        });

        describe("/assignments/{idParent}/tasks", () => {
            it("should return a list of tasks of assignment with status 200", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId + "/tasks")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "tasks": [normalQuestionId, multipleChoiceId]
                });
            });

            it("should return a list of tasks of user with status 200 (with steps)", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId + "/tasks?step=1")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "tasks": [normalQuestionId, multipleChoiceId]
                });
            });
        });
    });

    describe("DELETE /tasks/{id}", () => {
        let normalQuestionId: string;

        beforeEach(async () => {
            const taskResponse = await request(app)
                .post("/tasks")
                .send(mockNormalQuestion)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            normalQuestionId = taskResponse.body.id;
        });

        it("should delete a task with status 204", async () => {
            const response = await request(app)
                .delete("/tasks/" + normalQuestionId)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});

            const checkResponse = await request(app)
                .get("/tasks/" + normalQuestionId)
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(checkResponse.status).toBe(404);
        });
    })
});