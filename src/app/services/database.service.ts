import { Injectable } from '@angular/core';
import { User, users } from '../data/users';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    constructor() { }

    authenticate(email: string, password: string): Observable<User | null> {
        const user = users.find(u => u.email === email && u.password === password);
        return of(user || null);
    }

    getUserById(id: number): Observable<User | null> {
        const user = users.find(u => u.id === id);
        return of(user || null);
    }

    getAllUsers(): Observable<User[]> {
        return of(users);
    }
} 