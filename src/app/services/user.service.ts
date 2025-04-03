import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Client, Provider, Admin } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=CLIENT`).pipe(
      map(users => users as Client[])
    );
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=PROVIDER`).pipe(
      map(users => users as Provider[])
    );
  }

  getAdmins(): Observable<Admin[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=ADMIN`).pipe(
      map(users => users as Admin[])
    );
  }

  add(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, {
      ...user,
      updatedAt: new Date()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: boolean): Observable<User> {
    return this.update(id, { status });
  }
}
