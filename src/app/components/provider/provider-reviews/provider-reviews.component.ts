import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Review } from '../../../models/review.model';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass, DatePipe,    MatPaginatorModule],
  templateUrl: './provider-reviews.component.html',
  styleUrls: ['./provider-reviews.component.scss']
})
export class ProviderReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';
  clientsMap: { [key: number]: any } = {};
  servicesMap: { [key: number]: any } = {};
  paginatedReviews: Review[] = [];
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  pageIndex = 0;
  totalItems = 0;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.reviewService.getByProviderId(currentUser.id).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.totalItems = reviews.length;
          this.updatePaginatedReviews();
          this.loading = false;
          const serviceIds = [...new Set(reviews.map(r => r.serviceId))];
          const clientIds = [...new Set(reviews.map(r => r.clientId))];

          // Charger les services et clients
          this.loadServices(serviceIds);
          this.loadClients(clientIds);
        },
        error: (err) => {
          this.error = 'Error loading reviews: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  updatePaginatedReviews(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedReviews = this.reviews.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedReviews();
  }

  loadClients(clientIds: number[]): void {
    this.authService.getManyUsersByIds(clientIds).subscribe(clients => {
      this.clientsMap = clients.reduce((acc, client) => {
        acc[client.id] = client;
        return acc;
      }, {} as { [key: number]: any });
    });
  }

  loadServices(serviceIds: number[]): void {
    this.reviewService.getManyServicesByIds(serviceIds).subscribe(services => {
      this.servicesMap = services.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
      }, {} as { [key: number]: any });
    });
  }

  getStarRating(rating: number): string[] {
    return Array(5).fill('★').map((_, index) =>
      index < rating ? 'text-warning' : 'text-muted'
    );
  }

  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }
  getUserName(userId: number): string {
    const user = this.clientsMap[userId];
    return user ? `${user.username}` : `User #${userId}`;
  }
}
