export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    company: string;
    position: string;
    notes: string;
}

export const clients: Client[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        company: 'ABC Corp',
        position: 'CEO',
        notes: 'Important client, prefers email communication'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '(987) 654-3210',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        company: 'XYZ Inc',
        position: 'CTO',
        notes: 'Regular meetings on Fridays'
    }
]; 