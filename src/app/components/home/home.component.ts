import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { CategoryService } from '../../services/category.service';
import { ReviewService } from '../../services/review.service';
import { Service } from '../../models/service.model';
import { Category } from '../../models/category.model';
import { Review } from '../../models/review.model';
import { HttpClientModule } from "@angular/common/http";
import { HomePageService, HomeSection, Testimonial } from '../../services/home-page.service';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  categories: Category[] = [];
  testimonials: Review[] = [];
  loading = true;
  error = '';

  // ✅ Déclare le type pour éviter les erreurs NG9
  homeCategories: HomeSection[] = [];

  homeTestimonials: Testimonial[] = [];

  heroSection = {
    title: 'Quality Home Services',
    content: 'Qualified professionals for all your needs.\nSimple booking, guaranteed service.'
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private homePageService: HomePageService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.subscriptions.push(
      this.homePageService.getHeroSection().subscribe(heroSection => {
        this.heroSection = heroSection;
      }),

      this.homePageService.getCategories().subscribe(categories => {
        this.homeCategories = categories; // ✅ Angular reconnaît maintenant les propriétés comme image/title/content
      }),

      this.homePageService.getTestimonials().subscribe(testimonials => {
        this.homeTestimonials = testimonials;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load services. Please try again later.';
        this.loading = false;
        console.error('Error loading services:', err);
      }
    });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.testimonials = reviews;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }

  getStarRating(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
