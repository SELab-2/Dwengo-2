import { app } from "../../src/app";
import request from "supertest";

describe("Test learningObject API endpoints", () => {    
    describe("GET /learningObject", () => {
        it("Should get a list with multiple learningObjects", async () => {
            const response = await request(app)
                .get("/learningObject?searchTerm=karger")
                .set("Content-Type", "application/json")
                

            expect(response.status).toBe(200);
            expect(response.body.learningObjects.length).toEqual(14);
        });
    });

    describe("GET /learningObject/{id}", () => {
        const learningObjectId = "org-dwengo-elevator-riddle-monte-carlo-karger";
        it("Should get correct learningObject", async () => {
            const response = await request(app)
                .get("/learningObject/" + learningObjectId + "?type=raw")
                .set("Content-Type", "application/json")
                

            expect(response.status).toBe(200);
            expect(response.body.metadata.hruid).toEqual(learningObjectId);
            expect(response.body.metadata.description).toEqual(
                "The Karger algorithm uses the Monte Carlo method to arrive at a solution."
            );
        });

        it("Should get learningObject in Dutch", async () => {
            const response = await request(app)
                .get("/learningObject/" + learningObjectId + "?language=nl&type=raw")
                .set("Content-Type", "application/json")
                

            expect(response.status).toBe(200);
            expect(response.body.metadata.language).toEqual("nl");
            expect(response.body.metadata.hruid).toEqual(learningObjectId);
        });

        it("Should get learningObject in English", async () => {
            const response = await request(app)
                .get("/learningObject/" + learningObjectId + "?language=en&type=raw")
                .set("Content-Type", "application/json")
                

            expect(response.status).toBe(200);
            expect(response.body.metadata.language).toEqual("en");
            expect(response.body.metadata.hruid).toEqual(learningObjectId);
        });
    });
});

