/**
 * Interface for representing a message inside a question thread.
 */
export interface Message {
    id: string;
    creatorId: string;
    questionId: string;
    createdAt: Date;
    content: string;
    isInstructor: boolean;
  }
  
  /**
   * Interface for a message that is being created (no id yet).
   */
  export interface NewMessage {
    creatorId: string;
    questionId: string;
    content: string;
    isInstructor: boolean;
  }
  