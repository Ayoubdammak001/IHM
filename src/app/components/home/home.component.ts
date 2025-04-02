import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { CategoryService } from '../../services/category.service';
import { Service } from '../../models/service.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  services: Service[] = [];
  categories: Category[] = [];
  loading = true;
  error = '';

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService
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
        this.error = 'Error loading services. Please try again later.';
        this.loading = false;
      }
    });

    // Charger les catégories
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
} 