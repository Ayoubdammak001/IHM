import { Injectable } from '@angular/core';
import { Client, clients } from '../data/clients';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor() { }

    getClientById(id: number): Observable<Client | null> {
        const client = clients.find(c => c.id === id);
        return of(client || null);
    }

    getAllClients(): Observable<Client[]> {
        return of(clients);
    }

    updateClient(client: Client): Observable<Client> {
        const index = clients.findIndex(c => c.id === client.id);
        if (index !== -1) {
            clients[index] = client;
        }
        return of(client);
    }
} 