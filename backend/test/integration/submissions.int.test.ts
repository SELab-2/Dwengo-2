import { app } from "../../src/app";
import request from "supertest";
import { initializeUser, AuthDetails } from "./helpers";
import { StatusType } from "../../src/core/entities/submission";

describe('Test submission API endpoints', () => {
    let studentDetails: AuthDetails;
    let teacherDetails: AuthDetails;
    let assignmentId: string = "";
    let createdSubmissionId: string = "";
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
        // Create assignment
        const assignment = {
            classId: classRes.body.id,
            learningPathId: 'anm3',
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

        const submission = {
            studentId: studentDetails.id,
            assignmentId: assignmentId,
            taskId: taskId,
            learningObjectId: 'org-dwengo-elevator-riddle-question',
            time: new Date().toISOString(),
            contents: Buffer.from('Hello World').toString('base64'),
            status: StatusType.NOT_ACCEPTED,
        };

        const res = await request(app)
            .post('/submissions')
            .send(submission)
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + studentDetails.token);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        createdSubmissionId = res.body.id; // save for later tests
    });

    describe('POST /submissions', () => {
        it('should create a new submission', async () => {
            const submission = {
                studentId: studentDetails.id,
                assignmentId: assignmentId,
                taskId: taskId,
                learningObjectId: 'org-dwengo-elevator-riddle-question',
                time: new Date().toISOString(),
                contents: Buffer.from('Hello World').toString('base64'),
                status: StatusType.ACCEPTED,
            };

            const res = await request(app)
                .post('/submissions')
                .send(submission)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
        });
    });

    describe('GET /submissions/:id', () => {
        it('should retrieve the submission by ID', async () => {
            const res = await request(app)
                .get(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('studentId');
            expect(res.body).toHaveProperty('assignmentId');
            expect(res.body).toHaveProperty('taskId');
            expect(res.body).toHaveProperty('time');
            expect(res.body).toHaveProperty('contents');
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('learningObjectId');
        });

        it('should return 404 if submission does not exist', async () => {
            const res = await request(app)
                .get('/submissions/1238cd45-83f0-47ea-9ee6-8696684145f7')
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /submissions/:id', () => {
        it('should update the submission', async () => {
            const naRes = await request(app)
                .get(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);

            expect(naRes.status).toBe(200);
            expect(naRes.body.status).toBe("not_accepted");

            const update1 = await request(app)
                .patch(`/submissions/${createdSubmissionId}`)
                .send({
                    status: "accepted",
                })
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);

            expect(update1.status).toBe(204);

            const aRes = await request(app)
                .get(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(aRes.status).toBe(200);
            expect(aRes.body.status).toBe("accepted");

            const update2 = await request(app)
                .patch(`/submissions/${createdSubmissionId}`)
                .send({
                    status: "rejected",
                })
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);

            expect(update2.status).toBe(204);

            const rRes = await request(app)
                .get(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(rRes.status).toBe(200);
            expect(rRes.body.status).toBe("rejected");
        });
    });

    describe('DELETE /submissions/:id', () => {
        it('should delete the submission', async () => {
            const res = await request(app)
                .delete(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(204);

            const res2 = await request(app)
                .delete(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res2.status).toBe(404);
        });
    });

    describe('GET /users/:idParent/submissions', () => {
        it('should retrieve submissions of a user', async () => {
            const res = await request(app)
                .get(`/users/${studentDetails.id}/submissions`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('submissions');
            expect(Array.isArray(res.body.submissions)).toBe(true);
        });

        it('should retrieve submissions of a user with query params', async () => {
            const res = await request(app)
                .get(`/users/${studentDetails.id}/submissions?assignmentId=` + assignmentId + `&taskId=` + taskId)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('submissions');
            expect(Array.isArray(res.body.submissions)).toBe(true);
        });

        it('should return empty array if user has no submissions', async () => {
            // Delete the submission created in beforeEach
            await request(app)
                .delete(`/submissions/${createdSubmissionId}`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);
            const res = await request(app)
                .get(`/users/${studentDetails.id}/submissions`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + studentDetails.token);

            expect(res.status).toBe(200);
            expect(res.body.submissions).toEqual([]);
        });
    });

});