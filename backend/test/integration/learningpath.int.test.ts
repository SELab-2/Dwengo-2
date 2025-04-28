import { app } from "../../src/app";
import request from "supertest";

describe("Test learningPath API endpoints", () => {
    describe("GET /learningPath", () => {
            it("Should get a list with multiple learningPaths", async () => {
                const response = await request(app)
                    .get("/learningPath?all=karger")
                    .set("Content-Type", "application/json")
                    
    
                expect(response.status).toBe(200);
                expect(response.body.learningPaths.length).toEqual(2);
            });

            it("Should include nodes", async () => {
                const response = await request(app)
                    .get("/learningPath?all=karger&includeNodes=true")
                    .set("Content-Type", "application/json")
                    
    
                expect(response.status).toBe(200);
                expect(response.body.learningPaths[0]).toHaveProperty('nodes');
            });
        });

        describe("GET /learningPath/{id}", () => {
            it("Should get correct learningPath", async () => {
                const response = await request(app)
                    .get("/learningPath/anm3")
                    .set("Content-Type", "application/json")
                    
                expect(response.status).toBe(200);
                expect(response.body.hruid).toEqual("anm3");
                expect(response.body.numNodes).toEqual(20);
                expect(response.body.keywords).toEqual([
                    "grafen",
                    "algoritme",
                    "computationeel",
                    "denken",
                    "clustering",
                    "datastructuur",
                    "brute",
                    "force",
                    "pseudocode",
                    "python",
                    "monte",
                    "carlo",
                    "karger",
                    "spectrale",
                    "clustering"
                ])
            });

            it("Should get learningPath in Dutch", async () => {
                const response = await request(app)
                    .get("/learningPath/anm3?language=nl")
                    .set("Content-Type", "application/json")
                    
                expect(response.status).toBe(200);
                expect(response.body.hruid).toEqual("anm3");
                expect(response.body.numNodes).toEqual(20);
                expect(response.body.language).toEqual("nl");
            });

            it("Should get learningPath in English", async () => {
                const response = await request(app)
                    .get("/learningPath/anm3?language=en")
                    .set("Content-Type", "application/json")
                    
                expect(response.status).toBe(200);
                expect(response.body.hruid).toEqual("anm3");
                expect(response.body.numNodes).toEqual(20);
                expect(response.body.language).toEqual("en");
            });

            it("Should include nodes", async () => {
                const response = await request(app)
                    .get("/learningPath/anm3?includeNodes=true")
                    .set("Content-Type", "application/json")
                    
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('nodes');
            });
        });
});

