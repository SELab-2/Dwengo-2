import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";
import request from "supertest";

describe("Test question thread API Endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let assignmentId: string;
    let mockQuestionThread: object;

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

            const assignmentResponse = await request(app)
            .post("/assignments")
            .send({
                "classId": classReponse.body.id,
                "learningPathId": "string",
                "startDate": "2025-04-10",
                "deadline": "2025-04-10",
                "extraInstructions": "extra_instructions"
            })
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer " + teacherAuthDetails.token);

        assignmentId = assignmentResponse.body.id;

        mockQuestionThread = {
            "creatorId": studentAuthDetails.id,
            "assignmentId": assignmentId,
            "learningObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "isClosed": false,
            "visibility": "group"
          }
    });

    //TODO: consistency questionThread naming full stack (sometimes: threads, questions, questionThread)
    describe("POST /questions", () => {
        it("should create a question thread with status 201", async () => {
            const response = await request(app)
                .post("/questions")
                .send(mockQuestionThread)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("GET", () => {
        let questionThreadId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/questions")
                .send(mockQuestionThread)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);
            
            questionThreadId = response.body.id;
        });

        describe("/questions/{id}", () => {
            it("should return a question thread with status 200", async () => {
                const response = await request(app)
                    .get("/questions/" + questionThreadId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": questionThreadId,
                    "messageIds": [],
                    ...mockQuestionThread
                });
            })
        });

        describe("/assignment/{idParent}/questions", () => {
            it("should return a list of question threads for an assignment with status 200", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId + "/questions")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "threads": [questionThreadId]
                });
            });
        });
    });
});