import request from "supertest";
import { Express } from "express";

export type AuthDetails = {
    password: string,
    token: string,
    id: string
};

export async function initializeUser(userType: string, app: Express, _email: string = "jan12@gmail.com"): Promise<AuthDetails> {
    const password = "12345678";
    const mockUser = {
        email: _email,
        firstName: "Jan",
        familyName: "De nul",
        password: password,
        schoolName: "Yale",
        userType: userType
    };

    await request(app)
        .post("/register")
        .send(mockUser)
        .set("Content-Type", "application/json");

    const loginResponse = await request(app)
        .post("/login")
        .send({
            email: _email,
            password: password
        })
        .set("Content-Type", "application/json");
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    return {password, token, id};
}