import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Client, Provider, Admin } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.users)
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.users.find((user: User) => user.id === id))
    );
  }

  getClients(): Observable<Client[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.users.filter((user: User) => user.role === 'CLIENT'))
    );
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.users.filter((user: User) => user.role === 'PROVIDER'))
    );
  }

  getAdmins(): Observable<Admin[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.users.filter((user: User) => user.role === 'ADMIN'))
    );
  }

  add(user: Omit<User, 'id'>): Observable<User> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const newUser = {
          ...user,
          id: Math.max(...data.users.map((u: User) => u.id)) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data.users.push(newUser);
        return newUser;
      })
    );
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.users.findIndex((u: User) => u.id === id);
        if (index !== -1) {
          data.users[index] = { ...data.users[index], ...user, updatedAt: new Date() };
          return data.users[index];
        }
        throw new Error('User not found');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.users.findIndex((u: User) => u.id === id);
        if (index !== -1) {
          data.users.splice(index, 1);
        }
      })
    );
  }

  updateStatus(id: number, status: boolean): Observable<User> {
    return this.update(id, { status });
  }
}
