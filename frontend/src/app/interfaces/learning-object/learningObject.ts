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
    };
    content: string;
}

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
    }
}

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
