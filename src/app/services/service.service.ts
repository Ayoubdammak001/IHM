import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:3000/services';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  getManyByIds(ids: number[]): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}?${ids.map(id => `id=${id}`).join('&')}`);
  }

  getByProviderId(providerId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}?providerId=${providerId}`);
  }

  getByCategoryId(categoryId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  add(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  update(id: number, service: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
