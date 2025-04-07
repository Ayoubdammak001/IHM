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

@Component({
  selector: 'app-home',
  standalone: true,  // Composant standalone
  imports: [CommonModule, RouterModule],  // Ajouter CommonModule et RouterModule ici
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  categories: Category[] = [];
  testimonials: Review[] = [];
  loading = true;
  error = '';
  
  // Données de la page d'accueil
  heroSection!: HomeSection;
  homeCategories: HomeSection[] = [];
  homeTestimonials: Testimonial[] = [];
  
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
    
    // S'abonner aux données du service de la page d'accueil
    this.subscriptions.push(
      this.homePageService.getHeroSection().subscribe(heroSection => {
        this.heroSection = heroSection;
      }),
      
      this.homePageService.getCategories().subscribe(categories => {
        this.homeCategories = categories;
      }),
      
      this.homePageService.getTestimonials().subscribe(testimonials => {
        this.homeTestimonials = testimonials;
      })
    );
  }

  ngOnDestroy(): void {
    // Se désabonner de toutes les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    // Charger les services
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

    // Charger les catégories
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    // Charger les témoignages
    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.testimonials = reviews;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }

  // Méthode pour générer le tableau d'étoiles pour l'affichage des notes
  getStarRating(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
