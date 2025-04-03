import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/user.model';

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
} 