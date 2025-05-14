import { app } from "../../src/app";
import request from "supertest";
import { initializeUser, AuthDetails } from "./helpers";
import { StatusType } from "../../src/core/entities/submission";
import { UserType } from "../../src/core/entities/user";
let createdSubmissionId: string;

describe('Test progress API endpoints', () => {
    let studentDetails: AuthDetails;
    let teacherDetails: AuthDetails;
    let classId: string = "";
    let groupId: string = "";
    let assignmentId: string = "";
    let submissionId: string = "";

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
            .set("Authorization", "Bearer " + studentDetails.token);
        assignmentId = assignmentRes.body.id; // save for later tests

        const submission = {
            studentId: studentDetails.id,
            assignmentId: assignmentId,
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
        submissionId = res.body.id; // save for later tests
    });
    
    describe('GET /groups/:idParent/progress', () => {
        beforeEach(async () => {
            // Create a group
            const groupData = {
                members: [studentDetails.id],
                assignment: assignmentId,
            }
            const groupRes = await request(app)
                .post(`/groups`)
                .send(groupData)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(groupRes.status).toBe(201);
            groupId = groupRes.body.id;
        });

        it('should get progress for a group', async () => {
            const res = await request(app)
                .get(`/groups/${groupId}/progress`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('progresses');
            expect(res.body.progresses.length).toBe(1);
            expect(res.body.progresses[0].studentId).toBe(studentDetails.id);
            expect(res.body.progresses[0].assignmentId).toBe(assignmentId);
            expect(res.body.progresses[0].id).toBe(submissionId);
        });
    });

    describe('GET /assignments/:idParent/progress & GET /users/:idParent/progress', () => {
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
            const groupData = {
                members: [studentDetails.id],
                assignment: assignmentId,
            }
            const groupRes = await request(app)
                .post(`/groups`)
                .send(groupData)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(groupRes.status).toBe(201);
            groupId = groupRes.body.id;
        });
        it('should get progress for an assignment', async () => {
            const res = await request(app)
                .get(`/assignments/${assignmentId}/progress`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('progresses');
            expect(res.body.progresses.length).toBe(1);
            expect(res.body.progresses[0].studentId).toBe(studentDetails.id);
            expect(res.body.progresses[0].assignmentId).toBe(assignmentId);
            expect(res.body.progresses[0].id).toBe(submissionId);
        });

        it('should get progress for a user', async () => {
            const res = await request(app)
                .get(`/users/${studentDetails.id}/progress`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('progresses');
            expect(res.body.progresses.length).toBe(1);
            expect(res.body.progresses[0].studentId).toBe(studentDetails.id);
            expect(res.body.progresses[0].assignmentId).toBe(assignmentId);
            expect(res.body.progresses[0].id).toBe(submissionId);
        });

        it(('Should get progress for a user in an assignment'), async () => {
            const res = await request(app)
                .get(`/users/${studentDetails.id}/assignments/${assignmentId}/progress`)
                .set('Content-Type', 'application/json')
                .set("Authorization", "Bearer " + teacherDetails.token);
            expect(res.status).toBe(200);
            expect(res.body.studentId).toBe(studentDetails.id);
            expect(res.body.assignmentId).toBe(assignmentId);
            expect(res.body.step).toBe(1);
            expect(res.body.id).toBe(submissionId);
        });
    });
});