import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass, DatePipe],
  templateUrl: './provider-reviews.component.html',
  styleUrls: ['./provider-reviews.component.scss']
})
export class ProviderReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';

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
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading reviews: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  getStarRating(rating: number): string[] {
    return Array(5).fill('★').map((_, index) =>
      index < rating ? 'text-warning' : 'text-muted'
    );
  }
}
