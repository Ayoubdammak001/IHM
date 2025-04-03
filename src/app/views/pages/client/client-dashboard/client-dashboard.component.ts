import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Reservation } from '../../../../models/reservation.model';
import { Review } from '../../../../models/review.model';
import { Service } from '../../../../models/service.model';
import { User } from '../../../../models/user.model';
import { ReservationService } from '../../../../services/reservation.service';
import { ReviewService } from '../../../../services/review.service';
import { ServiceService } from '../../../../services/service.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ClientDashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  reviews: Review[] = [];
  loading = false;
  error = '';
  servicesMap: { [key: number]: Service } = {};
  providersMap: { [key: number]: User } = {};

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.loadReservations(currentUser.id);
      this.loadReviews(currentUser.id);
    } else {
      this.loading = false;
      this.error = 'User not logged in';
    }
  }

  private loadReservations(clientId: number): void {
    this.reservationService.getByClientId(clientId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;

        const serviceIds = [...new Set(reservations.map(r => r.serviceId))];
        const providerIds = [...new Set(reservations.map(r => r.providerId))];

        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds(serviceIds).subscribe({
            next: (services) => {
              this.servicesMap = services.reduce((acc, service) => {
                acc[service.id] = service;
                return acc;
              }, {} as { [key: number]: Service });
            },
            error: (err) => console.error('Error loading services:', err)
          });
        }

        if (providerIds.length > 0) {
          this.userService.getProviders().subscribe({
            next: (providers) => {
              this.providersMap = providers.reduce((acc, provider) => {
                acc[provider.id] = provider;
                return acc;
              }, {} as { [key: number]: User });
              this.loading = false;
            },
            error: (err) => {
              console.error('Error loading providers:', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error loading reservations.';
        this.loading = false;
      }
    });
  }

  private loadReviews(clientId: number): void {
    this.reviewService.getByClientId(clientId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        const serviceIds = reviews
          .map(r => r.serviceId)
          .filter(id => !this.servicesMap[id]);

        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds([...new Set(serviceIds)]).subscribe({
            next: (services) => {
              for (const service of services) {
                this.servicesMap[service.id] = service;
              }
            },
            error: (err) => console.error('Error loading services for reviews:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }

  getAcceptedReservationsCount(): number {
    return this.reservations.filter(r => r.status === 'ACCEPTED').length;
  }


  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }

  getProviderName(providerId: number): string {
    return this.providersMap[providerId]?.username ?? `Provider #${providerId}`;
  }

  getStarRating(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
