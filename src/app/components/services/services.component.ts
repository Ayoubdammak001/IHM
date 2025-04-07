import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Required for routerLink

import { ServiceService } from '../../services/service.service';
import { CategoryService } from '../../services/category.service';

import { Service } from '../../models/service.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule // ✅ Needed for [routerLink]
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  allServices: Service[] = [];
  displayedServices: Service[] = [];
  paginatedServices: Service[] = [];

  categories: Category[] = [];

  // Filters
  searchText: string = '';
  selectedCategory: string = '';
  maxPrice: number = 300;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;
  pageCount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
    });

    this.serviceService.getAll().subscribe(data => {
      this.allServices = data;
      this.applyFilters();

      this.route.queryParams.subscribe(params => {
        const categoryId = params['category'];
        if (categoryId) {
          this.selectedCategory = categoryId;
          this.applyFilters();
        }
      });
    });
  }

  applyFilters(): void {
    const filtered = this.allServices.filter(service => {
      const matchesCategory =
        !this.selectedCategory || service.categoryId.toString() === this.selectedCategory;

      const matchesSearch =
        !this.searchText ||
        service.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesPrice = service.price <= this.maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    });

    this.displayedServices = filtered;
    this.pageCount = Math.ceil(this.displayedServices.length / this.pageSize);
    this.goToPage(1);
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.maxPrice = 1000;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedServices = this.displayedServices.slice(start, end);
  }

  getPaginationButtons(): number[] {
    return Array(this.pageCount).fill(0).map((_, i) => i + 1);
  }

  getPageButtonStyle(page: number): { [key: string]: string } {
    return {
      backgroundColor: page === this.currentPage ? '#003366' : '#ffffff',
      color: page === this.currentPage ? '#ffffff' : '#003366',
      border: '1px solid #003366'
    };
  }

  getNavButtonStyle(disabled: boolean): { [key: string]: string } {
    return {
      backgroundColor: '#003366',
      color: '#ffffff',
      border: '1px solid #003366',
      opacity: disabled ? '0.5' : '1',
      pointerEvents: disabled ? 'none' : 'auto'
    };
  }
}
