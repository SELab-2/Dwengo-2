export interface Assignment {
    id: string;
    classId: string;
    startDate: Date;
    deadline: Date;
    extraInstructions: string;
    learningPathId: string;

    // name of the assignment
    name?: string;

    // name of parent class
    className?: string;
}