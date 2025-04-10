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
                    });

                await request(app)
                    .patch("/requests" + joinRequestResponse.body.id)
                    .set("Authorization", "Bearer " + teacherAuthDetails.token);
            })
        });
    });    
});