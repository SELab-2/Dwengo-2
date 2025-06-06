import request from "supertest";
import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";


describe("Tests for join requests API Endpoints", () => {
    let studentAuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let mockRequest: object;
    let classId: string;

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

        mockRequest = {
            "requester": studentAuthDetails.id,
            "class": classId,
            "userType": "student"
        }
    });

    describe("POST /requests", () => {
        it("should create a join request with status 201", async () => {
            const response = await request(app)
                .post("/requests")
                .send(mockRequest)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("GET", () => {
        let requestId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/requests")
                .send(mockRequest)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            requestId = response.body.id;
        });

        describe("/requests/{id}", () => {
            it("should get a request by id with status 200", async () => {
                const response = await request(app)
                    .get("/requests/" + requestId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": requestId,
                    "requester": studentAuthDetails.id,
                    "classId": classId,
                    "type": "student"
                });
            });
        });

        describe("/users/{idParent}/requests", () => {
            it("should get a list of requests by userId with status 200", async () => {
                const response = await request(app)
                    .get("/users/" + studentAuthDetails.id + "/requests?page=1&pageSize=20")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + studentAuthDetails.token);

                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "requests": [requestId]
                });
            });
        });
    });

    describe("PATCH /requests/{id}", () => {
        let requestId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/requests")
                .send(mockRequest)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            requestId = response.body.id;
        });

        it("should accept a join request with status 204", async () => {
            const response = await request(app)
                .patch("/requests/" + requestId)
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(204);

            const checkResponse = await request(app)
                .get("/requests/" + requestId)
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(checkResponse.status).toBe(404);
            expect(checkResponse.body).toEqual({
                "code": "NOT_FOUND",
                "message": "JoinRequest with ID " + requestId + " not found",
            });
        });
    });

    describe("DELETE /requests/{id}", () => {
        let requestId: string;

        beforeEach(async () => {
            const response = await request(app)
                .post("/requests")
                .send(mockRequest)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            requestId = response.body.id;
        });

        it("should delete a join request with status 204", async () => {
            const response = await request(app)
                .delete("/requests/" + requestId)
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(204);

            const checkResponse = await request(app)
                .get("/requests/" + requestId)
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(checkResponse.status).toBe(404);
            expect(checkResponse.body).toEqual({
                "code": "NOT_FOUND",
                "message": "JoinRequest with ID " + requestId + " not found",
            });
        });
    });
});