/**
 * Enum to represent the different types of content
 * that a learning object can have.
 */
enum LearningObjectContentType {
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
 * Typescript class that represents a learning object.
 * The specification for these objects can be found at:
 *  https://github.com/SELab-2/Dwengo-opgave/blob/main/extra_info/Dwengo_api_docs.pdf
 * 
 * We choose to make a selection of properties at first, and add more as needed.
 */
export class LearningObject {
  public constructor(
    private readonly _hruid: string,
    private readonly _uuid: string,
    private readonly _id: string,
    private readonly _version: number,
    private readonly _language: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _contentType: LearningObjectContentType,
  ) {}

  public get hruid(): string { return this._hruid; }
  public get uuid(): string { return this._uuid; }
  public get id(): string { return this._id; }
  public get version(): number { return this._version; }
  public get language(): string { return this._language; }
  public get title(): string { return this._title; }
  public get description(): string { return this._description; }
  public get contentType(): LearningObjectContentType { return this._contentType; }
}
