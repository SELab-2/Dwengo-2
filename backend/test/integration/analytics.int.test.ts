import { app } from "../../src/app";
import request from "supertest";
import { AuthDetails, initializeUser } from "./helpers";
import { StatusType } from "../../src/core/entities/submission";
import { UserType } from "../../src/core/entities/user";
describe("Test analytics endpoints", () => {
    let studentDetails: AuthDetails;
    let teacherDetails: AuthDetails;
    let classId: string = "";
    let groupId: string = "";
    let assignmentId: string = "";
    let taskId: string = "";

    beforeEach(async () => {
        teacherDetails = await initializeUser("teacher", app);
        studentDetails = await initializeUser("student", app, "jan13@gmail.com");

        // Create class
        const classData = {
            name: 'Test Class',
            description: 'This is a test class',
            targetAudience: 'students',
            teacherId: teacherDetails.id,
        };
        const classRes = await request(app)
            .post('/classes')
            .send(classData)
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + teacherDetails.token);
        classId = classRes.body.id;
        // Create assignment
        const assignment = {
            classId: classRes.body.id,
            learningPathId: 'anm3', // Has 20 steps in total
            name: 'Test Assignment',
            startDate: new Date().toISOString(),
            deadline: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
            extraInstructions: 'This is a test assignment',
        };
        const assignmentRes = await request(app)
            .post('/assignments')
            .send(assignment)
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + teacherDetails.token);
        assignmentId = assignmentRes.body.id; // save for later tests

        const task = {
            assignmentId: assignmentId,
            step: 1,
            question: "test-question",
            type: "NORMALQUESTION",
            details: {
                predefined_answer: "answer"
            }
        };
        const taskRes = await request(app)
            .post('/tasks')
            .send(task)
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + teacherDetails.token);
        taskId = taskRes.body.id;
    })

    describe('GET /classes/:idParent/completion', () => {
        const firstStep: string = "org-dwengo-elevator-riddle-question"
        const lastStep: string = "org-dwengo-elevator-riddle-extending-the-problem"

        // Make sure student is in class
        beforeEach(async () => {
            // Create joinRequest for the student to join the class
            const joinRequest = {
                requester: studentDetails.id,
                class: classId,
                userType: UserType.STUDENT
            };
            const joinRequestRes = await request(app)
                .post('/requests')
                .send(joinRequest)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);

            expect(joinRequestRes.status).toBe(201);
            // Accept the joinRequest
            const acceptJoinRequest = await request(app)
                .patch(`/requests/${joinRequestRes.body.id}`)
                .send()
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(acceptJoinRequest.status).toBe(204);
        });

        it("Completion should be 100% if only submission for assignment is the last step.", async () => {
            const submission = {
                studentId: studentDetails.id,
                assignmentId: assignmentId,
                taskId: taskId,
                learningObjectId: lastStep,
                time: new Date(),
                contents: Buffer.from(`Hello World}`).toString('base64'),
                status: StatusType.ACCEPTED,
            };

            const submissionRes = await request(app)
                .post('/submissions')
                .send(submission)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(submissionRes.status).toBe(201);
            const res = await request(app)
                .get(`/classes/${classId}/completion`)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherDetails.token)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('percentage');
            expect(res.body.percentage).toBe(100);
        })

        it("Completion should be 52.5% (21/40) if submission for first and last step.", async () => {
            let secondStudentId;
            const secondStudentDetails: AuthDetails = await initializeUser("student", app, "jan14@gmail.com");
            secondStudentId = secondStudentDetails.id;
            // Add the new student to the class
            // Create joinRequest for the student to join the class
            const joinRequest = {
                requester: secondStudentId,
                class: classId,
                userType: UserType.STUDENT
            };
            const joinRequestRes = await request(app)
                .post('/requests')
                .send(joinRequest)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);

            expect(joinRequestRes.status).toBe(201);
            // Accept the joinRequest
            const acceptJoinRequest = await request(app)
                .patch(`/requests/${joinRequestRes.body.id}`)
                .send()
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(acceptJoinRequest.status).toBe(204);
            // Create submission for first user
            const submission = {
                studentId: studentDetails.id,
                assignmentId: assignmentId,
                taskId: taskId,
                learningObjectId: firstStep,
                time: new Date(),
                contents: Buffer.from(`Hello World}`).toString('base64'),
                status: StatusType.ACCEPTED,
            };

            const submissionRes = await request(app)
                .post('/submissions')
                .send(submission)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(submissionRes.status).toBe(201);

            // Create submission for second user
            const secondSubmission = {
                studentId: secondStudentId,
                assignmentId: assignmentId,
                taskId: taskId,
                learningObjectId: lastStep,
                time: new Date(),
                contents: Buffer.from(`Hello World}`).toString('base64'),
                status: StatusType.ACCEPTED,
            };

            const secondSubmissionRes = await request(app)
                .post('/submissions')
                .send(secondSubmission)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);
            expect(secondSubmissionRes.status).toBe(201);

            const res = await request(app)
                .get(`/classes/${classId}/completion`)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherDetails.token)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('percentage');
            expect(res.body.percentage).toBe(52.5);
        })

        it("Completion should be 5% (1/20) if only submission for assignment is the first step.", async () => {
            const submission = {
                studentId: studentDetails.id,
                assignmentId: assignmentId,
                taskId: taskId,
                learningObjectId: firstStep,
                time: new Date(),
                contents: Buffer.from(`Hello World}`).toString('base64'),
                status: StatusType.ACCEPTED,
            };

            const submissionRes = await request(app)
                .post('/submissions')
                .send(submission)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(submissionRes.status).toBe(201);
            const res = await request(app)
                .get(`/classes/${classId}/completion`)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherDetails.token)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('percentage');
            expect(res.body.percentage).toBe(5);
        })

        it("Completion should be 0% if no submissions.", async () => {
            const res = await request(app)
                .get(`/classes/${classId}/completion`)
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + teacherDetails.token)
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('percentage');
            expect(res.body.percentage).toBe(0);
        })
    })

    //describe('GET /classes/:idParent/activity', () => {
    //    const amounts: number[] = [
    //        5,3,4,2,7,8,4,9,4,0,4,10 // 12 months
    //    ]
    //
    //    beforeEach(async () => {
    //        const now: Date = new Date();
    //        for (let i = 0; i < amounts.length; i++) {
    //            const count = amounts[i];
    //            const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 15); // middle of the month
    //
    //            for (let j = 0; j < count; j++) {
    //                const submission = {
    //                    studentId: studentDetails.id,
    //                    assignmentId: assignmentId,
    //                    taskId: taskId,
    //                    learningObjectId: 'org-dwengo-elevator-riddle-question',
    //                    time: monthDate.toISOString(),
    //                    contents: Buffer.from(`Hello World ${i}-${j}`).toString('base64'),
    //                    status: StatusType.ACCEPTED,
    //                };
    //            
    //                await request(app)
    //                    .post('/submissions')
    //                    .send(submission)
    //                    .set('Content-Type', 'application/json')
    //                    .set("Authorization", "Bearer " + studentDetails.token);
    //            }
    //        }
    //    })
    //
    //    it("Should get correct amount of submissions in the last 12 months for a class",async () => {
    //        const res = await request(app)
    //            .get(`/classes/${classId}/activity`)
    //            .set("Content-Type", "application/json")
    //            .set("Authorization", "Bearer " + teacherDetails.token)
    //        expect(res.status).toBe(200);
    //        expect(res.body).toHaveProperty('activity');
    //        expect(res.body.activity.length).toBe(12);
    //        const activity = res.body.activity;
    //        for (let i = 0; i < amounts.length; i++) {
    //            expect(amounts[i]).toBe(activity[i]);
    //        }
    //    })
    //})
})