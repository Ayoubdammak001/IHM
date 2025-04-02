import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-client-reviews',
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
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading reviews. Please try again later.';
        this.loading = false;
      }
    });
  }
} 