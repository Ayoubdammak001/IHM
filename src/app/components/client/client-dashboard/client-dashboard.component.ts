import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importer CommonModule
import { RouterModule } from '@angular/router';  // Importer RouterModule
import { ReservationService } from '../../../services/reservation.service';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Reservation } from '../../../models/reservation.model';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]  // Importer les modules nécessaires
})
export class ClientDashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  reviews: Review[] = [];
  loading = false;
  error = '';

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadReservations(currentUser.id);
      this.loadReviews(currentUser.id);
    }
  }

  private loadReservations(clientId: number): void {
    this.reservationService.getByClientId(clientId).subscribe({
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

  private loadReviews(clientId: number): void {
    this.reviewService.getByClientId(clientId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }
}
