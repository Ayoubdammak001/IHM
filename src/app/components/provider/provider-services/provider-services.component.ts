import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../services/service.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Service } from '../../../models/service.model';
import { Category } from '../../../models/category.model';

import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Paginator
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

// Custom Paginator Intl Provider
export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'First page';
  itemsPerPageLabel = 'Items per page:';
  lastPageLabel = 'Last page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return 'Page 1 of 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'app-provider-services',
  standalone: true,
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatPaginatorModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class ProviderServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  paginatedServices: Service[] = [];
  categories: Category[] = [];
  serviceForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  editingServiceId: number | null = null;
  photoPreview: string | null = null;

  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions = [ 5, 10,50];
  pageIndex = 0;

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.error = 'Error loading categories: ' + err.message;
      }
    });
  }

  loadServices(): void {
    this.loading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.serviceService.getByProviderId(currentUser.id).subscribe({
        next: (services) => {
          this.services = services;
          this.updatePagination();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading services: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.photoPreview = reader.result as string;
        this.serviceForm.patchValue({ imageUrl: this.photoPreview });
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    this.submitting = true;
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.error = 'User not authenticated';
      this.submitting = false;
      return;
    }

    const serviceData = {
      ...this.serviceForm.value,
      providerId: currentUser.id
    };

    if (this.editingServiceId) {
      this.serviceService.update(this.editingServiceId, serviceData).subscribe({
        next: (updatedService) => {
          this.services = this.services.map(service =>
            service.id === this.editingServiceId ? updatedService : service
          );
          this.updatePagination();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error updating service: ' + err.message;
          this.submitting = false;
        }
      });
    } else {
      this.serviceService.add(serviceData).subscribe({
        next: (newService) => {
          this.services.push(newService);
          this.updatePagination();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error creating service: ' + err.message;
          this.submitting = false;
        }
      });
    }
  }

  editService(service: Service): void {
    this.editingServiceId = service.id;
    this.photoPreview = service.imageUrl || null;

    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      price: service.price,
      categoryId: service.categoryId,
      duration: service.duration,
      imageUrl: service.imageUrl
    });

    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll vers le formulaire
  }

  deleteService(serviceId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.delete(serviceId).subscribe({
        next: () => {
          this.services = this.services.filter(service => service.id !== serviceId);
          this.updatePagination();
        },
        error: (err) => {
          this.error = 'Error deleting service: ' + err.message;
        }
      });
    }
  }

  resetForm(): void {
    this.serviceForm.reset();
    this.editingServiceId = null;
    this.submitting = false;
    this.photoPreview = null;
  }

  // Pagination methods
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePaginatedResults();
  }

  updatePagination() {
    this.filteredServices = [...this.services];
    this.totalItems = this.filteredServices.length;
    this.pageIndex = 0; // Reset to first page
    this.updatePaginatedResults();
  }

  updatePaginatedResults() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.filteredServices.slice(startIndex, endIndex);
  }
}
