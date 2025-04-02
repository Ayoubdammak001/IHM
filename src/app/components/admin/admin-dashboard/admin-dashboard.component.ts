import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ServiceService } from '../../../services/service.service';
import { CategoryService } from '../../../services/category.service';
import { ReviewService } from '../../../services/review.service';
import { User } from '../../../models/user.model';
import { Service } from '../../../models/service.model';
import { Category } from '../../../models/category.model';
import { Review } from '../../../models/review.model';
import { Role } from '../../../models/enums';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  services: Service[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
  loading = true;
  error = '';

  // Statistiques
  totalUsers = 0;
  totalProviders = 0;
  totalClients = 0;
  totalServices = 0;
  totalCategories = 0;
  totalReviews = 0;

  constructor(
    private userService: UserService,
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

    // Charger les utilisateurs
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.calculateUserStats(users);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading users. Please try again later.';
        this.loading = false;
      }
    });

    // Charger les services
    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.totalServices = services.length;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });

    // Charger les catégories
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.totalCategories = categories.length;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Charger les avis
    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.totalReviews = reviews.length;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  private calculateUserStats(users: User[]): void {
    this.totalUsers = users.length;
    this.totalProviders = users.filter(user => user.role === Role.PROVIDER).length;
    this.totalClients = users.filter(user => user.role === Role.CLIENT).length;
  }

  toggleUserStatus(userId: number, currentStatus: boolean): void {
    this.userService.updateStatus(userId, !currentStatus).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = !currentStatus;
        }
      },
      error: (error) => {
        this.error = 'Error updating user status. Please try again.';
      }
