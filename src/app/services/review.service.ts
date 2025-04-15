import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  // Helper method to convert date string to Date object
  private convertDate(review: any): Review {
    return {
      ...review,
      date: new Date(review.date)
    };
  }

  getAll(): Observable<Review[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(reviews => reviews.map(review => this.convertDate(review)))
    );
  }

  getById(id: number): Observable<Review> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(review => this.convertDate(review))
    );
  }

  getByServiceId(serviceId: number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}?serviceId=${serviceId}`).pipe(
      map(reviews => reviews.map(review => this.convertDate(review)))
    );
  }

  getByProviderId(providerId: number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}?providerId=${providerId}`).pipe(
      map(reviews => reviews.map(review => this.convertDate(review)))
    );
  }

  getByClientId(clientId: number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}?clientId=${clientId}`).pipe(
      map(reviews => reviews.map(review => this.convertDate(review)))
    );
  }

  createReview(review: Omit<Review, 'id'>): Observable<Review> {
    const reviewData = {
      ...review,
      date: review.date instanceof Date ? review.date.toISOString() : review.date
    };
    return this.http.post<any>(this.apiUrl, reviewData).pipe(
      map(newReview => this.convertDate(newReview))
    );
  }

  updateReview(review: Review): Observable<Review> {
    const reviewData = {
      ...review,
      date: review.date instanceof Date ? review.date.toISOString() : review.date
    };
    return this.http.put<any>(`${this.apiUrl}/${review.id}`, reviewData).pipe(
      map(updatedReview => this.convertDate(updatedReview))
    );
  }

  deleteReview(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => true)
    );
  }
} 