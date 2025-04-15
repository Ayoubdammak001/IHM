import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { UserService } from '../../../services/user.service';
import { ServiceService } from '../../../services/service.service';
import { CategoryService } from '../../../services/category.service';
import { ReviewService } from '../../../services/review.service';

import { User } from '../../../models/user.model';
import { Service } from '../../../models/service.model';
import { Category } from '../../../models/category.model';
import { Review } from '../../../models/review.model';
import { Role } from '../../../models/enums';
import {Client} from "../../../data/clients";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  services: Service[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
  clients: Client[] = [];

  loading = true;
  error = '';

  totalUsers = 0;
  totalProviders = 0;
  totalClients = 0;
  totalServices = 0;
  totalCategories = 0;
  totalReviews = 0;

  userRolesChart = {
    labels: ['Providers', 'Clients', 'Others'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#28a745', '#17a2b8', '#6c757d']
      }
    ]
  };

  totalStatsChart = {
    labels: ['Users', 'Services', 'Categories', 'Reviews'],
    datasets: [
      {
        label: 'Totals',
        data: [0, 0, 0, 0],
        backgroundColor: '#007bff'
      }
    ]
  };

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

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.calculateUserStats(users);
        this.loading = false;
        this.updateCharts();
      },
      error: () => {
        this.error = 'Error loading users. Please try again later.';
        this.loading = false;
      }
    });

    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.totalServices = services.length;
        this.updateCharts();
      },
      error: (err) => console.error('Error loading services:', err)
    });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.totalCategories = categories.length;
        this.updateCharts();
      },
      error: (err) => console.error('Error loading categories:', err)
    });

    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.totalReviews = reviews.length;
        this.updateCharts();
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  private calculateUserStats(users: User[]): void {
    this.totalUsers = users.length;
    this.totalProviders = users.filter(user => user.role === Role.PROVIDER).length;
    this.totalClients = users.filter(user => user.role === Role.CLIENT).length;
  }

  private updateCharts(): void {
    this.userRolesChart.datasets[0].data = [
      this.totalProviders,
      this.totalClients,
      this.totalUsers - this.totalProviders - this.totalClients
    ];

    this.totalStatsChart.datasets[0].data = [
      this.totalUsers,
      this.totalServices,
      this.totalCategories,
      this.totalReviews
    ];
  }

  toggleUserStatus(userId: number, currentStatus: boolean): void {
    this.userService.updateStatus(userId, !currentStatus).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = !currentStatus;
        }
      },
      error: () => {
        this.error = 'Error updating user status. Please try again.';
      }
    });
  }
  getClientName(clientId: number): string {
    const client = this.users.find(c => c.id === clientId);
    return client ? client.username : 'Unknown';
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    while (stars.length < totalStars) {
      stars.push('empty');
    }

    return stars;
  }


}
