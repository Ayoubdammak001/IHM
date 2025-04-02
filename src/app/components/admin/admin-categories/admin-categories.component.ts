import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  editingCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading categories: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.submitting = true;
    const categoryData = this.categoryForm.value;

    if (this.editingCategoryId) {
      this.categoryService.update(this.editingCategoryId, categoryData).subscribe({
        next: (updatedCategory) => {
          this.categories = this.categories.map(cat => 
            cat.id === this.editingCategoryId ? updatedCategory : cat
          );
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error updating category: ' + err.message;
          this.submitting = false;
        }
      });
    } else {
      this.categoryService.add(categoryData).subscribe({
        next: (newCategory) => {
          this.categories.push(newCategory);
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error creating category: ' + err.message;
          this.submitting = false;
        }
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter(cat => cat.id !== categoryId);
        },
        error: (err) => {
          this.error = 'Error deleting category: ' + err.message;
        }
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategoryId = null;
    this.submitting = false;
  }
} 