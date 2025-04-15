import { PathLearningObject, PathLearningObjectData } from "./learningObject";

/**
 * TypeAlias for a Base64String image representation
 */
type Base64String = string;

/**
 * Interface that defines the fields we support from the dwengo API for a learningPath
 * The specification for these objects can be found at:
 *  https://github.com/SELab-2/Dwengo-opgave/blob/main/extra_info/Dwengo_api_docs.pdf
 */
export interface LearningPathData {
    _id: string;
    language: string;
    hruid: string;
    title: string;
    description: string;
    image: Base64String;
    num_nodes: number;
    keywords: string;
    target_ages: number[];
    min_age: number;
    max_age: number;
    nodes: PathLearningObjectData[];
}

/**
 * Entity class that represents a learningPath in our backend application
 */
export class LearningPath {
    public constructor(
        private readonly _id: string,
        private readonly _language: string,
        private readonly _hruid: string,
        private readonly _title: string,
        private readonly _description: string,
        private readonly _image: Base64String,
        private readonly _numNodes: number,
        private readonly _keywords: string[],
        private readonly _targetAges: number[],
        private readonly _minAge: number,
        private readonly _maxAge: number,
        private readonly _nodes: PathLearningObject[],
    ) {}

    /**
     * Function to convert a learningPath entity to object format.
     *
     * @returns the learningPath object
     */
    public toObject(): object {
        return {
            id: this._id,
            language: this._language,
            hruid: this._hruid,
            title: this._title,
            description: this._description,
            image: this._image, // Base64 string
            numNodes: this._numNodes,
            keywords: this._keywords,
            targetAges: this._targetAges,
            minAge: this._minAge,
            maxAge: this._maxAge,
            nodes: this._nodes.map(node => node.toObject()), // Zet elk node-object om
        };
    }

    /**
     * Static function that maps a dwengo object for a learningPath to our entity type.
     *
     * @param object interface that defines the fields on the object data
     * @returns a LearningPath object
     */
    public static fromObject(object: LearningPathData): LearningPath {
        return new LearningPath(
            object._id,
            object.language,
            object.hruid,
            object.title,
            object.description,
            object.image, // Base64 string
            object.num_nodes,
            object.keywords.trim().replace(/["\\]/g, "").split(" "), // Split the single string into array of keywords and remove excess " and \.
            object.target_ages,
            object.min_age,
            object.max_age,
            object.nodes.map((node: PathLearningObjectData) => PathLearningObject.fromObject(node)),
        );
    }

    // Getters
    public get id(): string {
        return this._id;
    }
    public get language(): string {
        return this._language;
    }
    public get hruid(): string {
        return this._hruid;
    }
    public get title(): string {
        return this._title;
    }
    public get description(): string {
        return this._description;
    }
    public get image(): Base64String {
        return this._image;
    }
    public get numNodes(): number {
        return this._numNodes;
    }
    public get keywords(): string[] {
        return this._keywords;
    }
    public get targetAges(): number[] {
        return this._targetAges;
    }
    public get minAge(): number {
        return this._minAge;
    }
    public get maxAge(): number {
        return this._maxAge;
    }
    public get nodes(): PathLearningObject[] {
        return this._nodes;
    }
}
