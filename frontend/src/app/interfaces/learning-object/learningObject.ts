// This is the learning object as it is fetched from the database
export interface LearningObject {
    metadata: {
        hruid: string,
        uuid: string,
        id: string,
        version: number,
        language: string,
        title: string,
        description: string,
        contentType: string,
        step?: number;
    };
    // This is the object itself. The Dwengo server wraps it in for us.
    htmlContent: string;
}

// This is a learning object within a learning path (under the nodes property). It only has Identifier fields.
export interface ShallowLearningObject {
    hruid: string,
    id: string,
    version: number,
    language: string,
    startNode: boolean,
    transitions: {
        hruid: string,
        id: string,
        version: number,
        language: string,
    }[]
}

// This is the minimal data required for the GraphBuilder service. An assignment could extend this.
export interface MinimalLearningObject {
    metadata: {
        hruid: string,
        version: number,
        language: string,
    }
}

// This is the minimal data required to represent a learning object as it's givin within a learning path
export interface MinimalShallowLearningObject {
    hruid: string;
    version: number;
    language: string;
    startNode: boolean;
    transitions: {
        hruid: string,
        version: number,
        language: string,
    }[]
}

// This enum is used in LearninObjectRequests.
export enum HtmlType {
    WRAPPED = "wrapped",
    RAW = "raw"
}

export interface LearningObjectRequest {
    // the hruid as ID
    hruid: string;

    // wrapped means that the object is styled by to Dwengo itself, raw gives the raw html
    htmlType: HtmlType;

    // the language in two letter code
    language?: string,

    // the version number
    version?: number,
}
