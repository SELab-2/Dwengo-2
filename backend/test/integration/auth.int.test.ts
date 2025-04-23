import { app } from "../../src/app"
import request from "supertest"

describe("Test authentication API endpoints", () => {
    let mockUser: object;

    beforeEach(async () => {
        mockUser = {
            "email": "jan12@gmail.com",
            "firstName": "Jan",
            "familyName": "De nul",
            "password": "12345678",
            "schoolName": "Yale",
            "userType": "student"
        }
    })

    describe("POST /register", () => {
        it("should register a new user and return 201 status", async () => {
            const response = await request(app)
                .post('/register')
                .send(mockUser)
                .set("Content-Type", "application/json");

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                "id": expect.any(String)
            });
        });
    });

    describe("POST /login", () => {
        beforeEach(async () => {
            await request(app)
                .post('/register')
                .send(mockUser)
                .set("Content-Type", "application/json");
        });

        it("should login a user and return 200 status", async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    "email": "jan12@gmail.com",
                    "password": "12345678"
                })
                .set("Content-Type", "application/json");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "id": expect.any(String),
                "refreshToken": expect.any(String),
                "token": expect.any(String),
                "message": "Authentication successful",
                "userType": "student"
            })
        });
    });
})


