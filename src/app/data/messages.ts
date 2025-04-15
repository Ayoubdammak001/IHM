export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    subject: string;
    content: string;
    date: string;
    isRead: boolean;
}

export const messages: Message[] = [
    {
        id: 1,
        senderId: 1,
        receiverId: 2,
        subject: 'Appointment Confirmation',
        content: 'Your appointment has been confirmed for tomorrow at 10:00 AM.',
        date: '2024-03-14',
        isRead: false
    },
    {
        id: 2,
        senderId: 2,
        receiverId: 1,
        subject: 'Service Inquiry',
        content: 'I would like to know more about your massage services.',
        date: '2024-03-13',
        isRead: true
    }
]; 