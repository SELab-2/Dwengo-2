import { Assignment } from "../../interfaces/assignment";
import { Class } from "../../interfaces/classes/class";
import { Progress } from "../../interfaces/progress/progress";

export class MockServices {
    public static getClasses = () => {
        return [
            {
                id: "201",
                name: "Biologie 101",
                description: "Een introductie tot de biologie.",
                targetAudience: "Eerstejaars studenten",
                teacherId: "T1001",
                studentCount: 29,
                completionPercentage: 100,
                submissionActivity: [3, 5, 8, 7, 6, 9, 1],
                averageScore: 48,
            },
            {
                id: "202",
                name: "Wiskunde 201",
                description: "Gevorderde algebra en calculus.",
                targetAudience: "Tweedejaars studenten",
                teacherId: "T1002",
                studentCount: 12,
                completionPercentage: 29,
                submissionActivity: [1, 2, 5, 7, 3, 5, 4, 3, 2, 1, 1, 2, 3, 4],
                averageScore: 25,
            },
            {
                id: "203",
                name: "Geschiedenis 301",
                description: "Europese geschiedenis, 1400-1800.",
                targetAudience: "Derdejaars studenten",
                teacherId: "T1003",
                studentCount: 134,
                completionPercentage: 34,
                submissionActivity: [12, 15, 18, 10, 8, 5, 2, 7],
                averageScore: 81,
            },
            {
                id: "204",
                name: "Chemie Basis",
                description: "Een overzicht van de fundamentele principes van chemie.",
                targetAudience: "Eerstejaars studenten",
                teacherId: "T1004",
                studentCount: 30,
                completionPercentage: 80,
                submissionActivity: [8, 6, 7, 5, 1, 3],
                averageScore: 41,
            },
            {
                id: "205",
                name: "Informatica 101",
                description: "Introductie tot programmeren en algoritmen.",
                targetAudience: "Tweedejaars studenten",
                teacherId: "T1005",
                studentCount: 17,
                completionPercentage: 69,
                submissionActivity: [5, 3, 12, 8, 9, 6, 7],
                averageScore: 63,
            },
        ] as Class[];
    }
    public static getAssignments = () => {
        const now = new Date();
        const addDays = (days: number) => {
            const result = new Date(now);
            result.setDate(result.getDate() + days);
            return result;
        };
        return [
            {
                id: "1",
                name: "Hoofdstuk 1 Oefeningen",
                classId: "202",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Lees hoofdstuk 1 en maak de oefeningen.",
                learningPathId: "LP2001",
            },
            {
                id: "2",
                name: "Video over Natuurkunde",
                classId: "203",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Bekijk de video over natuurkunde.",
                learningPathId: "LP2002",
            },
            {
                id: "3",
                name: "Onderzoekspresentatie",
                classId: "203",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Doe onderzoek naar het onderwerp en presenteer het.",
                learningPathId: "LP2003",
            },
            {
                id: "4",
                name: "Artikel en Vragen",
                classId: "203",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Lees het artikel en beantwoord de vragen.",
                learningPathId: "LP2003",
            },
            {
                id: "5",
                name: "Samenvatting Hoofdstuk 5",
                classId: "203",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Maak een samenvatting van hoofdstuk 5.",
                learningPathId: "LP2003",
            },
            {
                id: "6",
                name: "Cijferanalyse Programma",
                classId: "205",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Schrijf een programma om cijfers te analyseren.",
                learningPathId: "LP2004",
            },
            {
                id: "7",
                name: "Zoekproblemen Algoritme",
                classId: "205",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Maak een algoritme voor zoekproblemen.",
                learningPathId: "LP2005",
            },
            {
                id: "8",
                name: "Boekenbibliotheek Database",
                classId: "205",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Ontwerp een database voor een boekenbibliotheek.",
                learningPathId: "LP2006",
            },
            {
                id: "9",
                name: "Principes van AI",
                classId: "205",
                startDate: addDays(-1),
                deadline: addDays(5),
                extraInstructions: "Onderzoek de principes van kunstmatige intelligentie.",
                learningPathId: "LP2007",
            },
        ] as Assignment[];
    }
    public static getProgress = (): Progress[] => {
      return [
        {
          id: 'p1',
          studentId: 's1',
          assignmentId: '1',
          learningObjectId: 'lo1',
          step: 3,
          maxStep: 5,
          time: new Date().toISOString(),
        },
        {
          id: 'p2',
          studentId: 's2',
          assignmentId: '2',
          learningObjectId: 'lo2',
          step: 1,
          maxStep: 4,
          time: new Date().toISOString(),
        },
        {
          id: 'p3',
          studentId: 's1',
          assignmentId: '3',
          learningObjectId: 'lo3',
          step: 5,
          maxStep: 5,
          time: new Date().toISOString(),
        }
      ];
    };
    public static getGroups = () => {
        return [{
            id: '1234',
            assignment: {
                id: '321',
                classId: '123',
                startDate: new Date(),
                deadline: new Date(),
                extraInstructions: 'Extra instructions',
                learningPathId: '123',
                name: 'Constructing profile HMMs'
            },
            members: [{
                id: '123', email: 'alice@bob.com', firstName: 'Alice', familyName: 'Daubechies', schoolName: 'Carol University', passwordHash: '1234',
            }]
        }];
    }
}
