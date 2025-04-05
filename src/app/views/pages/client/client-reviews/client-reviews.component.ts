import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Review } from "../../../../models/review.model";
import { ReviewService } from "../../../../services/review.service";
import { AuthService } from "../../../../services/auth.service";
import {
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
  TableDirective,
  ButtonDirective
} from '@coreui/angular';

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
  selector: 'app-client-reviews',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    ContainerComponent,
    RowComponent,
    TableDirective,
    ButtonDirective,
    MatPaginatorModule
  ],
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class ClientReviewsComponent implements OnInit {
  reviews: Review[] = [];
  paginatedReviews: Review[] = [];
  loading = true;
  error = '';
  currentClientId = 1;

  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReviews(this.currentClientId);
  }

  private loadReviews(clientId: number): void {
    this.reviewService.getByClientId(clientId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading reviews. Please try again later.';
        this.loading = false;
      }
    });
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  deleteReview(id: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.reviews = this.reviews.filter(review => review.id !== id);
            this.updatePagination();
          } else {
            this.error = 'Error deleting review.';
          }
        },
        error: () => {
          this.error = 'Error deleting review. Please try again.';
        }
      });
    }
  }

  // Pagination methods
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedResults();
  }

  updatePagination() {
    this.totalItems = this.reviews.length;
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedResults();
  }

  updatePaginatedResults() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReviews = this.reviews.slice(startIndex, endIndex);
  }
}
