export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: boolean;
}

export const users: User[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'admin123', // In production, this should be hashed
        role: 'ADMIN',
        status: true
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'user123', // In production, this should be hashed
        role: 'CLIENT',
        status: true
    },
    {
        id: 3,
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@example.com',
        password: 'provider123', // In production, this should be hashed
        role: 'PROVIDER',
        status: true
    }
]; 