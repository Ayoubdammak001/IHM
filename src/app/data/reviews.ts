export interface Review {
    id: number;
    clientId: number;
    providerId: number;
    serviceId: number;
    serviceName: string;
    rating: number;
    comment: string;
    date: string;
}

export const reviews: Review[] = [
    {
        id: 1,
        clientId: 1,
        providerId: 1,
        serviceId: 1,
        serviceName: 'Hair Cut',
        rating: 5,
        comment: 'Excellent service, very professional!',
        date: '2024-03-10'
    },
    {
        id: 2,
        clientId: 2,
        providerId: 2,
        serviceId: 2,
        serviceName: 'Massage',
        rating: 4,
        comment: 'Great experience, will come back!',
        date: '2024-03-12'
    }
]; 