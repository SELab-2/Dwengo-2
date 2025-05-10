/**
 * Interface for representing a message inside a question thread.
 */
export interface Message {
    id: string;
    senderId: string;
    threadId: string;
    createdAt: Date;
    content: string;
  }
  
  /**
   * Interface for a message that is being created (no id yet).
   */
  export interface NewMessage {
    senderId: string;
    threadId: string;
    createdAt: Date;
    content: string;
  }
  