/**
 * Response for multiple messages tied to a question
 */
export interface MessageResponse {
    messages: string[];
  }
  
  /**
   * Response for creating a new message
   */
  export interface MessageResponseSingle {
    id: string;
  }
  