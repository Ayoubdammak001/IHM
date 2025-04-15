import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/user.model';

interface DashboardData {
  totalSpent: number;
  recommendedServices: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
  }>;
  popularServices: Array<{
    name: string;
    count: number;
  }>;
  monthlyBookings: Array<{
    month: string;
    count: number;
  }>;
  serviceSatisfaction: Array<{
    name: string;
    score: number;
  }>;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    getClientById(id: number): Observable<Client | null> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.apiUrl}?role=CLIENT`);
    }

    updateClient(client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
    }

    addClient(client: Omit<Client, 'id'>): Observable<Client> {
        const newClient = {
            ...client,
            role: 'CLIENT',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return this.http.post<Client>(this.apiUrl, newClient);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getDashboardData(): Observable<DashboardData> {
        // For now, return mock data. In a real application, this would come from your backend
        return of({
            totalSpent: 1250.00,
            recommendedServices: [
                {
                    id: '1',
                    name: 'Professional Cleaning',
                    description: 'Complete home cleaning service',
                    price: 150.00
                },
                {
                    id: '2',
                    name: 'Garden Maintenance',
                    description: 'Regular garden care and maintenance',
                    price: 200.00
                },
                {
                    id: '3',
                    name: 'Interior Design',
                    description: 'Professional interior design consultation',
                    price: 300.00
                }
            ],
            popularServices: [
                { name: 'Cleaning', count: 45 },
                { name: 'Gardening', count: 30 },
                { name: 'Design', count: 25 },
                { name: 'Repairs', count: 20 },
                { name: 'Moving', count: 15 }
            ],
            monthlyBookings: [
                { month: 'Jan', count: 5 },
                { month: 'Feb', count: 8 },
                { month: 'Mar', count: 12 },
                { month: 'Apr', count: 15 },
                { month: 'May', count: 10 },
                { month: 'Jun', count: 18 }
            ],
            serviceSatisfaction: [
                { name: 'Cleaning', score: 4.5 },
                { name: 'Gardening', score: 4.8 },
                { name: 'Design', score: 4.2 },
                { name: 'Repairs', score: 4.6 },
                { name: 'Moving', score: 4.3 }
            ]
        });
    }
} 