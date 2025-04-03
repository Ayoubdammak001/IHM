import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'assets/db.json';  // Remplace cette URL par l'URL réelle de ton API.

  constructor(private http: HttpClient) {}

  getAll(): Observable<Service[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.services)
    );
  }

  getById(id: number): Observable<Service> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.services.find((service: Service) => service.id === id))  // Recherche du service par ID
    );
  }

  getByProviderId(providerId: number): Observable<Service[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.services.filter((service: Service) => service.providerId === providerId))
    );
  }

  getByCategoryId(categoryId: number): Observable<Service[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.services.filter((service: Service) => service.categoryId === categoryId))
    );
  }

  add(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const newService = {
          ...service,
          id: Math.max(...data.services.map((s: Service) => s.id)) + 1
        };
        data.services.push(newService);
        return newService;
      })
    );
  }

  update(id: number, service: Partial<Service>): Observable<Service> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.services.findIndex((s: Service) => s.id === id);
        if (index !== -1) {
          data.services[index] = { ...data.services[index], ...service };
          return data.services[index];
        }
        throw new Error('Service not found');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.services.findIndex((s: Service) => s.id === id);
        if (index !== -1) {
          data.services.splice(index, 1);
        }
      })
    );
  }
}
