import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";
import request from "supertest";

describe("Test message API Endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let questionThreadId: string;
    let mockMessage: object;

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
            "name": "name",
            "extraInstructions": "extra_instructions"
        })
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + teacherAuthDetails.token);

        const questionThreadResponse = await request(app)
                .post("/questions")
                .send({
                    "creatorId": studentAuthDetails.id,
                    "assignmentId": assignmentResponse.body.id,
                    "learningObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "isClosed": false,
                    "visibility": "group"
                })
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);
                
        questionThreadId = questionThreadResponse.body.id;

        mockMessage = {
            "senderId": studentAuthDetails.id,
            "threadId": questionThreadId,
            "createdAt": "2025-04-10T00:00:00.000Z",
            "content": "string"
        }
    });

    describe("POST /messages", () => {
        it("should create a message with status 201", async () => {
            const response = await request(app)
                .post("/messages")
                .send(mockMessage)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("GET", () => {
        let messageId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/messages")
                .send(mockMessage)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + studentAuthDetails.token);
            
            messageId = response.body.id;
        });

        describe("/messages/{id}", () => {
            it("should return a message with status 200", async () => {
                const response = await request(app)
                    .get("/messages/" + messageId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": messageId,
                    ...mockMessage
                });
            })
        });

        describe("/questions/{idParent}/messages", () => {
            it("should return a list of messages for an question thread with status 200", async () => {
                const response = await request(app)
                    .get("/questions/" + questionThreadId + "/messages")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "messages": [messageId]
                });
            });
        });
    });
});