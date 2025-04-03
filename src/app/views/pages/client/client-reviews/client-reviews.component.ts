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
    ButtonDirective
  ],
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.scss']
})
export class ClientReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  error = '';

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadReviews(currentUser.id);
    }
  }

  private loadReviews(clientId: number): void {
    this.reviewService.getByClientId(clientId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
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
}
