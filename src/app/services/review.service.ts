import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews)
    );
  }

  getById(id: number): Observable<Review> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews.find((review: Review) => review.id === id))
    );
  }

  getByServiceId(serviceId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews.filter((review: Review) => review.serviceId === serviceId))
    );
  }

  getByProviderId(providerId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews.filter((review: Review) => review.providerId === providerId))
    );
  }

  getByClientId(clientId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews.filter((review: Review) => review.clientId === clientId))
    );
  }

  add(review: Omit<Review, 'id'>): Observable<Review> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const newReview = {
          ...review,
          id: Math.max(...data.reviews.map((r: Review) => r.id)) + 1,
          date: new Date()
        };
        data.reviews.push(newReview);
        return newReview;
      })
    );
  }

  update(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.reviews.findIndex((r: Review) => r.id === id);
        if (index !== -1) {
          data.reviews[index] = { ...data.reviews[index], ...review };
          return data.reviews[index];
        }
        throw new Error('Review not found');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.reviews.findIndex((r: Review) => r.id === id);
        if (index !== -1) {
          data.reviews.splice(index, 1);
        }
      })
    );
  }
} 