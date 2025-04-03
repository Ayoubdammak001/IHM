import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review.model';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  standalone :true,
  styleUrls: ['./admin-reviews.component.scss'],
  imports :[CommonModule]
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = '';
    this.reviewService.getAll().subscribe({
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

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(review => review.id !== reviewId);
        },
        error: (err) => {
          this.error = 'Error deleting review: ' + err.message;
        }
      });
    }
  }

  getStarRating(rating: number): string[] {
    return Array(5).fill('★').map((star, index) =>
      index < rating ? 'text-warning' : 'text-muted'
    );
  }
}
