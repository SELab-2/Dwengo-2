import { group } from "console";
import { app } from "../../src/app";
import { AuthDetails, initializeUser } from "./helpers";
import request from "supertest";

describe("Test group API Endpoints", () => {
    let student1AuthDetails: AuthDetails;
    let student2AuthDetails: AuthDetails;
    let teacherAuthDetails: AuthDetails;
    let assignmentId: string;
    let mockGroup: object;

    beforeEach(async () => {
        student1AuthDetails = await initializeUser("student", app);
        student2AuthDetails = await initializeUser("student", app, "student1@gmail.com");
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

        mockGroup = {
            "assignment": assignmentId,
            "members": [
              student1AuthDetails.id,
              student2AuthDetails.id
            ]
        }
    });

    describe("POST /groups", () => {
        it("should create a group with status 201", async () => {
            const response = await request(app)
                .post("/groups")
                .send(mockGroup)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("GET", () => {
        let groupId: string;
        
        beforeEach(async () => {
            const response = await request(app)
                .post("/groups")
                .send(mockGroup)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherAuthDetails.token);
            
            groupId = response.body.id;
        });

        describe("/groups/{id}", () => {
            it("should return a group with status 200", async () => {
                const response = await request(app)
                    .get("/groups/" + groupId)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "id": groupId,
                    ...mockGroup
                });
            });
        });

        //TODO: No check if student is already in group or other group
        describe("/users/{idParent}/groups", () => {
            it("should return a list of groups of user with status 200", async () => {
                const response1 = await request(app)
                    .get("/users/" + student1AuthDetails.id + "/groups")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + student1AuthDetails.token)
    
                expect(response1.status).toBe(200);
                expect(response1.body).toEqual({
                    "groups": [groupId]
                });

                const response2 = await request(app)
                    .get("/users/" + student2AuthDetails.id + "/groups")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + student2AuthDetails.token)
    
                expect(response2.status).toBe(200);
                expect(response2.body).toEqual({
                    "groups": [groupId]
                });
            });
        });

        describe("/assignments/{idParent}/groups", () => {
            it("should return a lsit of groups of assignment with status 200", async () => {
                const response = await request(app)
                    .get("/assignments/" + assignmentId + "/groups")
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + student1AuthDetails.token)
    
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    "groups": [groupId]
                });
            });
        })
    });
});