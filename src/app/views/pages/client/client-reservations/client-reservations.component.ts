import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ReservationService } from '../../../../services/reservation.service';
import { ServiceService } from '../../../../services/service.service';
import { UserService } from '../../../../services/user.service';
import { ReviewService } from '../../../../services/review.service';
import { Reservation } from '../../../../models/reservation.model'; // ✅ modèle officiel
import { ReservationStatus } from '../../../../models/enums'; // ✅ enum
import { Service } from '../../../../models/service.model';
import { User } from '../../../../models/user.model';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  TableDirective,
  ButtonDirective,
  BadgeComponent,
  PaginationComponent,
  FormDirective,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalTitleDirective,
  FormControlDirective,
  FormSelectDirective
} from '@coreui/angular';

// Material Paginator
import { MatPaginatorModule, PageEvent, MatPaginatorIntl} from "@angular/material/paginator";
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
  templateUrl: './client-reservations.component.html',
  styleUrls: ['./client-reservations.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    BadgeComponent,
    PaginationComponent,
    MatPaginatorModule,
    FormDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalTitleDirective,
    FormControlDirective,
    FormSelectDirective,

  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class ClientReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  paginatedReservations: Reservation[] = [];
  currentClientId = 1;
  servicesMap: { [key: number]: Service } = {};
  providersMap: { [key: number]: User } = {};
  loading = false;

  // Review modal
  reviewModal = false;
  selectedReservation: Reservation | null = null;
  reviewForm: FormGroup;
  submittingReview = false;
  success = '';
  error = '';

  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;

  // Filtering
  statusFilter: string = '';

  protected readonly ReservationStatus = ReservationStatus;

  constructor(
    private reservationService: ReservationService,
    private serviceService: ServiceService,
    private userService: UserService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(0)]]
    });
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getByClientId(this.currentClientId)
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
        this.applyFilters();

        // Get unique service IDs
        const serviceIds = Array.from(new Set(reservations.map(r => r.serviceId)));

        // Get unique provider IDs
        const providerIds = Array.from(new Set(reservations.map(r => r.providerId)));

        // Fetch services and providers
        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds(serviceIds).subscribe(services => {
            this.servicesMap = services.reduce((acc, service) => {
              acc[service.id] = service;
              return acc;
            }, {} as { [key: number]: Service });
            this.loading = false;
          });
        }

        if (providerIds.length > 0) {
          this.userService.getProviders().subscribe(providers => {
            this.providersMap = providers.reduce((acc, provider) => {
              acc[provider.id] = provider;
              return acc;
            }, {} as { [key: number]: User });
            this.loading = false;
          });
        }
      });
  }

  cancelReservation(id: number): void {
    this.reservationService.cancelReservation(id)
      .subscribe(success => {
        if (success) {
          this.loadReservations();
        }
      });
  }

  // Review methods
  openReviewModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.reviewForm.reset({ rating: 5, comment: '' });
    this.reviewModal = true;
    this.cdr.detectChanges();
  }

  closeReviewModal(): void {
    this.reviewModal = false;
    this.selectedReservation = null;
    this.error = '';
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.selectedReservation) {
      return;
    }

    this.submittingReview = true;
    const reviewData = {
      clientId: this.currentClientId,
      providerId: this.selectedReservation.providerId,
      serviceId: this.selectedReservation.serviceId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      date: new Date()
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.success = 'Review submitted successfully!';
        this.submittingReview = false;
        this.closeReviewModal();
        // Hide success message after 3 seconds
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to submit review. Please try again.';
        this.submittingReview = false;
        console.error('Error submitting review:', err);
      }
    });
  }

  getBadgeColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.ACCEPTED:
        return 'success';
      case ReservationStatus.PENDING:
        return 'warning';
      case ReservationStatus.CANCELLED:
      case ReservationStatus.REJECTED:
        return 'danger';
      case ReservationStatus.COMPLETED:
        return 'info';
      default:
        return 'secondary';
    }
  }

  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }

  getProviderName(providerId: number): string {
    return this.providersMap[providerId]?.username ?? `Provider #${providerId}`;
  }

  // Handle page events
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedResults();
  }

  // Apply filters and update pagination
  applyFilters(): void {
    let filtered = [...this.reservations];

    // Apply status filter if selected
    if (this.statusFilter) {
      filtered = filtered.filter(reservation => reservation.status === this.statusFilter);
    }

    this.filteredReservations = filtered;
    this.totalItems = this.filteredReservations.length;
    this.pageIndex = 0; // Reset to first page when filtering
    this.updatePaginatedResults();
  }

  // Update paginated results based on current page and page size
  updatePaginatedResults(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReservations = this.filteredReservations.slice(startIndex, endIndex);
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.applyFilters();
  }
}
