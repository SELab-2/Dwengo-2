import { app } from "../../src/app"
import request from "supertest"
import bcript from "bcryptjs"
import { AuthDetails, initializeUser } from "./helpers";

describe("Test user API endpoints", () => {
    let authDetails: AuthDetails;

    describe("GET /user/{studentId}", () => {
        beforeEach(async () => {
            authDetails = await initializeUser("student", app);
        });

        it("should return a student with status 200", async () => {
            const response = await request(app)
                .get("/users/" + authDetails.id + "?userType=student")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + authDetails.token)

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "id": authDetails.id,
                "email": "jan12@gmail.com",
                "firstName": "Jan",
                "familyName": "De nul",
                "passwordHash": expect.any(String),
                "schoolName": "Yale"
            });
            expect(await bcript.compare(authDetails.password, response.body.passwordHash)).toBe(true);
        });

    });
    describe("GET /user/{teacherId}", () => {
        beforeEach(async () => {
            authDetails = await initializeUser("teacher", app, "teacher@gmail.com");
        });

        it("should return a teacher with status 200", async () => {
            const response = await request(app)
                .get("/users/" + authDetails.id + "?userType=teacher")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + authDetails.token)

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "id": authDetails.id,
                "email": "teacher@gmail.com",
                "firstName": "Jan",
                "familyName": "De nul",
                "passwordHash": expect.any(String),
                "schoolName": "Yale"
            });
            expect(await bcript.compare(authDetails.password, response.body.passwordHash)).toBe(true);
        });
    });
    
});