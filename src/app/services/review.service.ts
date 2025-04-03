import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { reviews } from '../data/reviews';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  // Helper method to convert data Review to model Review
  private convertToModelReview(dataReview: any): Review {
    return {
      id: dataReview.id,
      rating: dataReview.rating,
      comment: dataReview.comment,
      date: new Date(dataReview.date),
      clientId: dataReview.clientId,
      providerId: dataReview.providerId,
      serviceId: dataReview.serviceId
    };
  }

  getAll(): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews.map((review: any) => this.convertToModelReview(review)))
    );
  }

  getById(id: number): Observable<Review> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => this.convertToModelReview(data.reviews.find((review: any) => review.id === id)))
    );
  }

  getByServiceId(serviceId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews
        .filter((review: any) => review.serviceId === serviceId)
        .map((review: any) => this.convertToModelReview(review))
      )
    );
  }

  getByProviderId(providerId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews
        .filter((review: any) => review.providerId === providerId)
        .map((review: any) => this.convertToModelReview(review))
      )
    );
  }

  getByClientId(clientId: number): Observable<Review[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reviews
        .filter((review: any) => review.clientId === clientId)
        .map((review: any) => this.convertToModelReview(review))
      )
    );
  }

  getReviewsByClientId(clientId: number): Observable<Review[]> {
    return of(reviews
      .filter(review => review.clientId === clientId)
      .map(review => this.convertToModelReview(review))
    );
  }

  createReview(review: Omit<Review, 'id'>): Observable<Review> {
    const newReview: any = {
      ...review,
      id: Math.max(...reviews.map(r => r.id)) + 1,
      date: review.date.toISOString().split('T')[0],
      serviceName: '' // Required by data model
    };
    reviews.push(newReview);
    return of(this.convertToModelReview(newReview));
  }

  updateReview(review: Review): Observable<Review> {
    const index = reviews.findIndex(r => r.id === review.id);
    if (index !== -1) {
      const dataReview = {
        ...review,
        date: review.date.toISOString().split('T')[0],
        serviceName: reviews[index].serviceName // Preserve existing serviceName
      };
      reviews[index] = dataReview;
      return of(this.convertToModelReview(dataReview));
    }
    return of(review);
  }

  deleteReview(id: number): Observable<boolean> {
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
} 