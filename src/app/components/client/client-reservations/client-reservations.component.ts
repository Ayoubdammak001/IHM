import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { ReviewService } from '../../../services/review.service';
import { Reservation } from '../../../models/reservation.model';
import { ReservationStatus } from '../../../models/enums';

// Material Paginator
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

// Custom Paginator Intl Provider
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'First page';
  itemsPerPageLabel = 'Items per page:';
  lastPageLabel = 'Last page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return 'Page 1 of 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './client-reservations.component.html',
  styleUrls: ['./client-reservations.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class ClientReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  paginatedReservations: Reservation[] = [];
  loading = true;
  error = '';
  success = '';
  ReservationStatus = ReservationStatus; // Pour utiliser l'enum dans le template
  
  // Modal review
  selectedReservation: Reservation | null = null;
  reviewForm: FormGroup;
  submittingReview = false;

  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadReservations(currentUser.id);
    }
  }

  private loadReservations(clientId: number): void {
    this.loading = true;
    this.reservationService.getByClientId(clientId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading reservations. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Affiche le modal d'écriture d'avis pour une réservation complétée
  openReviewModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.reviewForm.reset({ rating: 5, comment: '' });
  }

  // Ferme le modal d'avis
  closeReviewModal(): void {
    this.selectedReservation = null;
  }

  // Envoie l'avis
  submitReview(): void {
    if (this.reviewForm.invalid || !this.selectedReservation) {
      return;
    }

    this.submittingReview = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.error = 'You must be logged in to submit a review';
      this.submittingReview = false;
      return;
    }

    const reviewData = {
      clientId: currentUser.id,
      providerId: this.selectedReservation.providerId,
      serviceId: this.selectedReservation.serviceId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      date: new Date()
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.success = 'Review submitted successfully!';
        this.closeReviewModal();
        this.submittingReview = false;
      },
      error: (err) => {
        this.error = 'Failed to submit review. Please try again.';
        this.submittingReview = false;
        console.error('Error submitting review:', err);
      }
    });
  }

  // Pagination methods
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedResults();
  }

  updatePagination() {
    this.totalItems = this.reservations.length;
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedResults();
  }

  updatePaginatedResults() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReservations = this.reservations.slice(startIndex, endIndex);
  }
}
