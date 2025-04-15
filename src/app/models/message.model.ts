export interface Message {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    date: Date;
    read: boolean;
  }