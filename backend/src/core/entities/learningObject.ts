/**
 * Enum to represent the different types of content
 * that a learning object can have.
 */
export enum LearningObjectContentType {
    PLAIN_TEXT = "plain/text",
    MARKDOWN_TEXT = "text/markdown",
    IMAGE_BLOCK = "image/image-block",
    IMAGE = "image/image",
    MPEG = "audio/mpeg",
    PDF = "application/pdf",
    EXTERN = "extern",
    BLOCKLY = "blockly",
}

/**
 * Enum to represent the different types of html-content
 * that a learning object can have.
 */
export enum HTMLType {
    WRAPPED = "wrapped",
    RAW = "raw",
}

/**
 * Interface that defines basic fields of a learningObject properties from the Dwengo API that are shared among all
 * Can also be used for a LearningObject inside of transition
 */
interface BaseLearningObjectData {
    _id: string;
    version: number;
    hruid: string;
    language: string;
}

/**
 * Class that can be used by learningObjects on their own or learningObjects inside a learningPath
 * Can also be used as a LearningObject inside of a transition
 * 
 * The specification for these objects can be found at:
 *  https://github.com/SELab-2/Dwengo-opgave/blob/main/extra_info/Dwengo_api_docs.pdf
 */
// 

export class BaseLearningObject {
    public constructor(
        protected readonly _id: string,
        protected readonly _hruid: string,
        protected readonly _version: number,
        protected readonly _language: string,

    ) {}

    public get id(): string {
        return this._id;
    }
    public get hruid(): string {
        return this._hruid;
    }
    public get version(): number {
        return this._version;
    }
    public get language(): string {
        return this._language;
    }

    /**
     * Base toObject() method that child classes can extend.
     */
    protected baseToObject(): object {
        return {
            hruid: this._hruid,
            id: this._id,
            version: this._version,
            language: this._language,
        };
    }

    public toObject(): object {
        return this.baseToObject();
    }

    /**
     * Static function that maps a dwengo object for a learningObject to our entity type.
     * 
     * @param object interface that defines the fields on the object data
     * @returns a BaseLearningObject object
     */
    public static fromObject(object: BaseLearningObjectData): BaseLearningObject {
        return new BaseLearningObject(
            object._id,
            object.hruid,
            object.version,
            object.language
        )
    }
}

/**
 * Interface that represents the fields we support
 * for a learningObject inside of a learningPath from the Dwengo API
 */
export interface PathLearningObjectData extends BaseLearningObjectData {
    learningobject_hruid: string;
    start_node: boolean;
    transitions: BaseLearningObjectData[];
}

/**
 * Typescript class that represents a learning object inside of a learningPath.
 * The specification for these objects can be found at:
 *  https://github.com/SELab-2/Dwengo-opgave/blob/main/extra_info/Dwengo_api_docs.pdf
 *
 */
export class PathLearningObject extends BaseLearningObject {
    public constructor(
        hruid: string,
        id: string,
        version: number,
        language: string,
        private readonly _startNode: boolean,
        private readonly _transitions: BaseLearningObject[],
    ) {super(hruid, id, version, language)}

    public toObject(): object {
        return {
            ...this.baseToObject(),
            startNode: this._startNode,
            transitions: this._transitions.map((t) => t.toObject())
        };
    }

    /**
     * Static function that maps a dwengo object for a learningObject to our entity type.
     * 
     * @param object interface that defines the fields on the object data
     * @returns a PathLearningObject object
     */
    public static fromObject(object: PathLearningObjectData): PathLearningObject {
        return new PathLearningObject(
            object._id,
            object.learningobject_hruid,
            object.version,
            object.language,
            object.start_node,
            object.transitions.map((t: any) => BaseLearningObject.fromObject(t.next)),
        );
    }

}

/**
 * Interface that represents the fields we support
 * for a standalone learningObject outside of a learningPath from the Dwengo API
 */
export interface LearningObjectData extends BaseLearningObjectData {
    uuid: string;
    hruid: string;
    title: string;
    description: string;
    contentType: LearningObjectContentType;
}

/**
 * Typescript class that represents a learning object.
 * The specification for these objects can be found at:
 *  https://github.com/SELab-2/Dwengo-opgave/blob/main/extra_info/Dwengo_api_docs.pdf
 *
 * We choose to make a selection of properties at first, and add more as needed.
 */
export class LearningObject extends BaseLearningObject {
    public constructor(
        hruid: string,
        id: string,
        version: number,
        language: string,
        private readonly _uuid: string,
        private readonly _title: string,
        private readonly _description: string,
        private _htmlContent: string = "",
        private readonly _contentType: LearningObjectContentType,
    ) {super(id, hruid, version, language)}

    
    public get uuid(): string {
        return this._uuid;
    }
    public get title(): string {
        return this._title;
    }
    public get description(): string {
        return this._description;
    }
    public get htmlContent(): string {
        return this._htmlContent;
    }
    public set htmlContent(htmlContent: string) {
        this._htmlContent = htmlContent;
    }
    public get contentType(): LearningObjectContentType {
        return this._contentType;
    }

    public toObject(includeHtmlContent: boolean = true) {
        return {
            metadata: {
                ...this.baseToObject(), 
                uuid: this._uuid,
                title: this._title,
                description: this._description,
                contentType: this._contentType,
            },
            ...(includeHtmlContent && { htmlContent: this._htmlContent }),
        };
    }
    
    /**
     * Static function that maps a dwengo object for a learningObject to our entity type.
     * 
     * @param object interface that defines the fields on the object data
     * @returns a LearningObject object
     */
    public static fromObject(object: LearningObjectData): LearningObject {
        return new LearningObject(
            object.hruid,
            object._id,
            object.version,
            object.language,
            object.uuid,
            object.title,
            object.description,
            "",
            object.contentType,
        );
    }
}
