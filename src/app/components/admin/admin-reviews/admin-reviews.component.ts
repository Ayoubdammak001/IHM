import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../models/review.model';
import { Service } from '../../../models/service.model';
import { ReviewService } from '../../../services/review.service';
import { ServiceService } from '../../../services/service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule], // Import de ngx-pagination
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss']
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  servicesMap: { [key: number]: Service } = {};
  clientsMap: { [key: number]: any } = {};
  loading = false;
  error = '';
  p: number = 1;  // Page actuelle

  constructor(
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = '';

    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        const serviceIds = Array.from(new Set(reviews.map(r => r.serviceId)));
        const clientIds = Array.from(new Set(reviews.map(r => r.clientId)));

        if (clientIds.length > 0) {
          this.authService.getManyUsersByIds(clientIds).subscribe(clients => {
            this.clientsMap = clients.reduce((acc, client) => {
              acc[client.id] = client;
              return acc;
            }, {} as { [key: number]: User });
          });
        }

        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds(serviceIds).subscribe({
            next: (services) => {
              console.log('Fetched services:', services);
              this.servicesMap = services.reduce((acc, service) => {
                acc[service.id] = service;
                return acc;
              }, {} as { [key: number]: Service });
              console.log('Services map:', this.servicesMap);
              this.loading = false;
            },
            error: () => {
              this.error = 'Error loading services';
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }

      },
      error: (err) => {
        this.error = 'Error loading reviews: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(review => review.id !== reviewId);
        },
        error: (err) => {
          this.error = 'Error deleting review: ' + err.message;
        }
      });
    }
  }

  getStarRating(rating: number): string[] {
    return Array(5).fill('★').map((_, i) => i < rating ? 'text-warning' : 'text-muted');
  }

  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }
  getUserName(userId: number): string {
    const user = this.clientsMap[userId];
    return user ? `${user.username}` : `User #${userId}`;
  }

}
