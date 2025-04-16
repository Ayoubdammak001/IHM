import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePageService, HomeSection, Testimonial } from '../../../services/home-page.service';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../services/service.service';
import { CategoryService } from '../../../services/category.service';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  heroForm: FormGroup;
  categoriesForm: FormGroup;
  testimonialsForm: FormGroup;

  heroSection!: HomeSection;
  categories: HomeSection[] = [];
  testimonials: Testimonial[] = [];

  // Données existantes
  existingCategories: any[] = [];
  existingReviews: any[] = [];

  // Variables pour gérer l'édition
  editingCategory: HomeSection | null = null;
  editingTestimonial: Testimonial | null = null;

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private homePageService: HomePageService,
    private categoryService: CategoryService,
    private reviewService: ReviewService
  ) {
    this.heroForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.categoriesForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [''],
      categoryId: [''] // ID de la catégorie existante
    });

    this.testimonialsForm = this.fb.group({
      clientName: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewId: [''] // ID du témoignage existant
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadExistingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData(): void {
    this.subscriptions.push(
      this.homePageService.getHeroSection().subscribe(heroSection => {
        this.heroSection = heroSection;
        this.heroForm.patchValue(heroSection);
      }),

      this.homePageService.getCategories().subscribe(categories => {
        this.categories = categories;
      }),

      this.homePageService.getTestimonials().subscribe(testimonials => {
        this.testimonials = testimonials;
      })
    );
  }

  loadExistingData(): void {
    // Charger les catégories existantes
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.existingCategories = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories existantes:', error);
      }
    });

    // Charger les témoignages existants
    this.reviewService.getAll().subscribe({
      next: (data) => {
        this.existingReviews = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des témoignages existants:', error);
      }
    });
  }

  // Méthodes pour la section héro
  updateHeroSection(): void {
    if (this.heroForm.valid) {
      this.homePageService.updateHeroSection(this.heroForm.value);
      this.heroForm.reset(this.heroSection);
    }
  }

  // Méthodes pour les catégories
  addCategory(): void {
    if (this.categoriesForm.valid) {
      const categoryId = this.categoriesForm.value.categoryId;

      if (categoryId) {
        // Trouver la catégorie existante
        const existingCategory = this.existingCategories.find(c => c.id === categoryId);

        if (existingCategory) {
          // Créer une nouvelle entrée de catégorie pour la page d'accueil
          const newCategory: HomeSection = {
            id: Date.now().toString(),
            title: existingCategory.name || this.categoriesForm.value.title,
            content: existingCategory.description || this.categoriesForm.value.content,
            image: existingCategory.image || this.categoriesForm.value.image,
            order: this.categories.length + 1
          };

          this.homePageService.addCategory(newCategory);
          this.categoriesForm.reset();
        }
      } else {
        // Si aucune catégorie existante n'est sélectionnée, utiliser les valeurs du formulaire
        const newCategory: HomeSection = {
          id: Date.now().toString(),
          title: this.categoriesForm.value.title,
          content: this.categoriesForm.value.content,
          image: this.categoriesForm.value.image,
          order: this.categories.length + 1
        };

        this.homePageService.addCategory(newCategory);
        this.categoriesForm.reset();
      }
    }
  }

  editCategory(category: HomeSection): void {
    this.editingCategory = category;
    this.categoriesForm.patchValue(category);
  }

  updateCategory(): void {
    if (this.categoriesForm.valid && this.editingCategory) {
      // Mettre à jour la catégorie existante
      const updatedCategory = {
        ...this.editingCategory,
        ...this.categoriesForm.value
      };
      this.homePageService.updateCategory(updatedCategory);
      this.editingCategory = null;
      this.categoriesForm.reset();
    }
  }

  deleteCategory(id: string): void {
    this.homePageService.deleteCategory(id);
  }

  cancelCategoryEdit(): void {
    this.editingCategory = null;
    this.categoriesForm.reset();
  }

  // Méthodes pour les témoignages
  addTestimonial(): void {
    if (this.testimonialsForm.valid) {
      const reviewId = this.testimonialsForm.value.reviewId;

      if (reviewId) {
        // Trouver le témoignage existant
        const existingReview = this.existingReviews.find(r => r.id === reviewId);

        if (existingReview) {
          // Créer une nouvelle entrée de témoignage pour la page d'accueil
          const newTestimonial: Testimonial = {
            id: Date.now(),
            clientName: existingReview.clientName || this.testimonialsForm.value.clientName,
            comment: existingReview.comment || this.testimonialsForm.value.comment,
            rating: existingReview.rating || this.testimonialsForm.value.rating,
            date: new Date()
          };

          this.homePageService.addTestimonial(newTestimonial);
          this.testimonialsForm.reset();
        }
      } else {
        // Si aucun témoignage existant n'est sélectionné, utiliser les valeurs du formulaire
        const newTestimonial: Testimonial = {
          id: Date.now(),
          clientName: this.testimonialsForm.value.clientName,
          comment: this.testimonialsForm.value.comment,
          rating: this.testimonialsForm.value.rating,
          date: new Date()
        };

        this.homePageService.addTestimonial(newTestimonial);
        this.testimonialsForm.reset();
      }
    }
  }

  editTestimonial(testimonial: Testimonial): void {
    this.editingTestimonial = testimonial;
    this.testimonialsForm.patchValue(testimonial);
  }

  updateTestimonial(): void {
    if (this.testimonialsForm.valid && this.editingTestimonial) {
      // Mettre à jour le témoignage existant
      const updatedTestimonial = {
        ...this.editingTestimonial,
        ...this.testimonialsForm.value
      };
      this.homePageService.deleteTestimonial(this.editingTestimonial.id);
      this.homePageService.addTestimonial(updatedTestimonial);
      this.editingTestimonial = null;
      this.testimonialsForm.reset();
    }
  }

  deleteTestimonial(id: number): void {
    this.homePageService.deleteTestimonial(id);
  }

  cancelTestimonialEdit(): void {
    this.editingTestimonial = null;
    this.testimonialsForm.reset();
  }

  // Méthode pour générer un tableau de booléens pour l'affichage des étoiles
  getStarRating(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      this.selectedImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedImage) return;

    try {
      // Convertir l'image en base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;

        // Mettre à jour le formulaire avec l'URL de l'image
        this.categoriesForm.patchValue({
          image: base64Image
        });

        // Réinitialiser la sélection d'image
        this.selectedImage = null;
        this.imagePreview = null;

        // Réinitialiser l'input file
        const fileInput = document.getElementById('categoryImage') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      };
      reader.readAsDataURL(this.selectedImage);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  }
}
