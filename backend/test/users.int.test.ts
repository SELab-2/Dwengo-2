import { app } from "../src/app"
import request from "supertest"
import log4js from "log4js";
import { MockTypeORM } from "mock-typeorm"
import { UserTypeORM } from "../src/infrastructure/database/data/data_models/userTypeorm";
import { Student } from "../src/core/entities/student";
import { StudentTypeORM } from "../src/infrastructure/database/data/data_models/studentTypeorm";
import { Server } from "http";
import { logger } from "../src/config/logger";
import { DataSource } from "typeorm";

describe("Test users API endpoints", () => {
    let typeorm: MockTypeORM;
    let mockUser: object;
    let userModel: UserTypeORM;
    let studentModel: StudentTypeORM;
    let server: Server;

    beforeAll(async () => {
        typeorm = new MockTypeORM();
        server = app.listen(4000);
    });

    afterAll(async () => {
        typeorm.restore();
        server.close();        
    });

    beforeEach(() => {
        mockUser = {
            "email": "jan12@gmail.com",
            "firstName": "Jan",
            "familyName": "De nul",
            "password": "12345678",
            "schoolName": "Yale",
            "userType": "student"
        }
        const student: Student = new Student(
            "jan12@gmail.com",
            "Jan",
            "De nul",
            "12345678",
            "Yale"
        )
        userModel = UserTypeORM.createUserTypeORM(student);
        userModel.id = "student-123"; 
        studentModel = StudentTypeORM.createStudentTypeORM(student, userModel);
        studentModel.id = "student-123";
    })

    afterEach(() => {
        typeorm.resetAll();
    })

    describe("POST user", () => {
        beforeEach(() => {
            typeorm.onMock('UserTypeORM').toReturn(userModel, 'save');
            typeorm.onMock('StudentTypeORM').toReturn(studentModel, 'save');
        });

        it("should register a new user and return 201 status", async () => {
            typeorm.onMock('UserTypeORM').toReturn(null, 'findOne').toReturn(null, 'findOne')
            const response = await request(app)
                .post('/register')
                .send(mockUser)
                .set("Content-Type", "application/json");

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toEqual("student-123");
        });
    });
})


