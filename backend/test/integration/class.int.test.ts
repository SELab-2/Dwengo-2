import { app } from "../../src/app";
import request from "supertest";
import { AuthDetails, initializeUser } from "./helpers";

describe("Test class API endpoints", () => {
    let authDetails: AuthDetails;
    let mockClass: object;
    let classId: string;
    
    beforeEach(async () => {
        authDetails = await initializeUser("teacher", app);
        mockClass = {
            "name": "class_123",
            "description": "string",
            "targetAudience": "string",
            "teacherId": authDetails.id
        };
    });

    describe("POST /classes", () => {
        it("should create a class and return id with status 201", async () => {
            const response = await request(app)
                .post("/classes")
                .send(mockClass)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + authDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("GET /classes/{id}", () => {
        beforeEach(async () => {
            const response = await request(app)
                .post("/classes")
                .send(mockClass)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + authDetails.token);
            
            classId = response.body.id;
        });

        describe("/classes/{id}", () => {
            it("should return a class with status 200", async () => {
                const response = await request(app)
                    .get("/classes/" + classId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + authDetails.token)
    
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": classId,
                    "name": "class_123",
                    "description": "string",
                    "targetAudience": "string",
                });
            });
        });

        describe("GET /users/{idParent}/classes", () => {
            it("should return a list of classes of user with status 200", async () => {
                const response = await request(app)
                    .get("/users/" + authDetails.id + "/classes")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + authDetails.token)
    
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "classes": [classId]
                });
            });
        });
    });

    describe("PATCH /classes/{id}", () => {
        let updatedClass: object;

        beforeEach(async () => {
            const response = await request(app)
                .post("/classes")
                .send(mockClass)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + authDetails.token);
            
            classId = response.body.id;

            updatedClass = {
                "name": "newName"
            }
        });

        it("should update a class with status 204", async () => {
            const response = await request(app)
                .patch("/classes/" + classId)
                .send(updatedClass)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + authDetails.token);
            
            expect(response.status).toBe(204);

            const checkResponse = await request(app)
                .get("/classes/" + classId)
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + authDetails.token); 
                
            expect(checkResponse.status).toBe(200);
            expect(checkResponse.body).toEqual({
                "id": classId,
                "name": "newName",
                "description": "string",
                "targetAudience": "string",
            });
        });
    });

    describe("DELETE /classes/{id}", () => {
        beforeEach(async () => {
            const response = await request(app)
                .post("/classes")
                .send(mockClass)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + authDetails.token);
            
            classId = response.body.id;
        });

        it("should delete a class with status 204", async () => {
            const response = await request(app)
                .delete("/classes/" + classId)
                .set("Authorization", "Bearer " + authDetails.token);
            
            expect(response.status).toBe(204);

            const checkResponse = await request(app)
                    .get("/classes/" + classId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + authDetails.token);
                
                expect(checkResponse.status).toBe(404);
                expect(checkResponse.body).toEqual({
                    "code": "NOT_FOUND",
                    "message": "Class with ID " + classId +" not found",
                });
        });
    });
});

