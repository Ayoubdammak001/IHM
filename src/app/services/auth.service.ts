import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Role } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/db.json'; // 📁 Simulated backend
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // 🔹 Getter pour accès rapide au user actuel
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // 🔹 Est-ce que quelqu’un est connecté ?
  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // 🔹 Login (authentification locale à partir du fichier JSON simulé)
  login(email: string, password: string): Observable<User> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const user = data.users.find((u: User) =>
          u.email === email && u.password === password && u.status
        );

        if (!user) {
          throw new Error('Invalid credentials');
        }

        // 🧠 Stockage local + maj de BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  // 🔹 Déconnexion
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // 🔹 Vérifie si le user est authentifié
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // 🔹 Vérifie si le user a un rôle donné
  hasRole(role: Role): boolean {
    return this.currentUserValue?.role === role;
  }

  getManyUsersByIds(ids: number[]): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        return data.users.filter((user: User) => ids.includes(user.id));
      })
    );
  }

}
