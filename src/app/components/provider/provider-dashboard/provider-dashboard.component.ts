import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { ReviewService } from '../../../services/review.service';
import { ServiceService } from '../../../services/service.service';
import { AuthService } from '../../../services/auth.service';
import { Reservation } from '../../../models/reservation.model';
import { Review } from '../../../models/review.model';
import { Service } from '../../../models/service.model';
import { ReservationStatus } from '../../../models/enums';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss']
})
export class ProviderDashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  reviews: Review[] = [];
  services: Service[] = [];
  loading = true;
  error = '';

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadReservations(currentUser.id);
      this.loadReviews(currentUser.id);
      this.loadServices(currentUser.id);
    }
  }

  private loadReservations(providerId: number): void {
    this.reservationService.getByProviderId(providerId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading reservations. Please try again later.';
        this.loading = false;
      }
    });
  }

  private loadReviews(providerId: number): void {
    this.reviewService.getByProviderId(providerId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  private loadServices(providerId: number): void {
    this.serviceService.getByProviderId(providerId).subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  updateReservationStatus(reservationId: number, status: ReservationStatus): void {
    this.reservationService.updateStatus(reservationId, status).subscribe({
      next: () => {
        // Mettre à jour la liste des réservations
        const index = this.reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
          this.reservations[index] = { ...this.reservations[index], status };
        }
      },
      error: (error) => {
        this.error = 'Error updating reservation status. Please try again.';
      }
    });
  }
} 