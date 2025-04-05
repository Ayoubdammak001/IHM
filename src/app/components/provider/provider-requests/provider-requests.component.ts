import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
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
  selector: 'app-provider-requests',
  standalone: true,
  templateUrl: './provider-requests.component.html',
  styleUrls: ['./provider-requests.component.scss'],
  imports: [CommonModule, NgClass, DatePipe, MatPaginatorModule],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class ProviderRequestsComponent implements OnInit {
  requests: Reservation[] = [];
  filteredRequests: Reservation[] = [];
  paginatedRequests: Reservation[] = [];
  loading = false;
  error = '';
  ReservationStatus = ReservationStatus;

  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;

  // Filter
  statusFilter: string = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.reservationService.getByProviderId(currentUser.id).subscribe({
        next: (requests) => {
          this.requests = requests;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading requests: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  updateStatus(requestId: number, status: ReservationStatus): void {
    this.reservationService.updateStatus(requestId, status).subscribe({
      next: () => {
        this.requests = this.requests.map(request =>
          request.id === requestId ? { ...request, status } : request
        );
        this.applyFilters();
      },
      error: (err) => {
        this.error = 'Error updating request: ' + err.message;
      }
    });
  }

  // Handle page events
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedResults();
  }

  // Apply filters and update pagination
  applyFilters(): void {
    let filtered = [...this.requests];
    
    // Apply status filter if selected
    if (this.statusFilter) {
      filtered = filtered.filter(request => request.status === this.statusFilter);
    }
    
    this.filteredRequests = filtered;
    this.totalItems = this.filteredRequests.length;
    this.pageIndex = 0; // Reset to first page when filtering
    this.updatePaginatedResults();
  }

  // Update paginated results based on current page and page size
  updatePaginatedResults(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRequests = this.filteredRequests.slice(startIndex, endIndex);
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
