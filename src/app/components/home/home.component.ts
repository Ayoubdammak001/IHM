import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajouter CommonModule
import { RouterModule } from '@angular/router'; // Ajouter RouterModule
import { ServiceService } from '../../services/service.service';
import { CategoryService } from '../../services/category.service';
import { ReviewService } from '../../services/review.service';
import { Service } from '../../models/service.model';
import { Category } from '../../models/category.model';
import { Review } from '../../models/review.model';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-home',
  standalone: true,  // Composant standalone
  imports: [CommonModule, RouterModule],  // Ajouter CommonModule et RouterModule ici
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  services: Service[] = [];
  categories: Category[] = [];
  testimonials: Review[] = [];
  loading = true;
  error = '';

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = '';

    // Charger les services
    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des services. Veuillez réessayer plus tard.';
        this.loading = false;
        console.error('Erreur de chargement des services:', error);
      }
    });

    // Charger les catégories
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur de chargement des catégories:', error);
      }
    });

    // Charger les témoignages (reviews avec notes élevées)
    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        // Filtrer pour avoir des témoignages de qualité (4-5 étoiles)
        this.testimonials = reviews
          .filter(review => review.rating >= 4 && review.comment && review.comment.length > 10)
          .slice(0, 3); // Limiter à 3 témoignages
      },
      error: (error) => {
        console.error('Erreur de chargement des témoignages:', error);
      }
    });
  }

  // Méthode pour générer le tableau d'étoiles pour l'affichage des notes
  getStarRating(rating: number): boolean[] {
    return Array(5).fill(true).map((_, i) => i < rating);
  }
}
