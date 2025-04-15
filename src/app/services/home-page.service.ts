import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HomeSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface Testimonial {
  id: number;
  clientName: string;
  comment: string;
  rating: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  private heroSectionSubject = new BehaviorSubject<HomeSection>({
    id: 'hero',
    title: 'Quality Home Services',
    content: 'Qualified professionals for all your needs.\nSimple booking, guaranteed service.',
    order: 1
  });

  private categoriesSubject = new BehaviorSubject<HomeSection[]>([
    {
      id: 'plumbing',
      title: '🔩Plumbing & Repairs',
      content: 'Installation & repair of sanitary fixtures, sinks, taps and pipes',
      image: 'assets/images/category/plumbing.jpg',
      order: 1
    },
    {
      id: 'electrical',
      title: '👨‍🔧Electrical Repair',
      content: 'Electrical Installation & Maintenance',
      image: 'assets/images/category/electrical-repair.jpg',
      order: 2
    }
  ]);

  private testimonialsSubject = new BehaviorSubject<Testimonial[]>([
    {
      id: 1,
      clientName: 'Marie Dupont',
      comment: 'Exceptional service! The provider arrived on time and did an outstanding job.',
      rating: 5,
      date: new Date()
    }
  ]);

  constructor() {
    // Charger les données depuis le localStorage au démarrage
    this.loadFromLocalStorage();
  }

  // Méthodes pour le Hero Section
  getHeroSection(): Observable<HomeSection> {
    return this.heroSectionSubject.asObservable();
  }

  updateHeroSection(heroSection: HomeSection): void {
    this.heroSectionSubject.next(heroSection);
    this.saveToLocalStorage();
  }

  // Méthodes pour les Catégories
  getCategories(): Observable<HomeSection[]> {
    return this.categoriesSubject.asObservable();
  }

  addCategory(category: HomeSection): void {
    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next([...currentCategories, category]);
    this.saveToLocalStorage();
  }

  updateCategory(category: HomeSection): void {
    const currentCategories = this.categoriesSubject.value;
    const index = currentCategories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      currentCategories[index] = category;
      this.categoriesSubject.next([...currentCategories]);
      this.saveToLocalStorage();
    }
  }

  deleteCategory(categoryId: string): void {
    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next(currentCategories.filter(c => c.id !== categoryId));
    this.saveToLocalStorage();
  }

  // Méthodes pour les Témoignages
  getTestimonials(): Observable<Testimonial[]> {
    return this.testimonialsSubject.asObservable();
  }

  addTestimonial(testimonial: Testimonial): void {
    const currentTestimonials = this.testimonialsSubject.value;
    this.testimonialsSubject.next([...currentTestimonials, testimonial]);
    this.saveToLocalStorage();
  }

  deleteTestimonial(testimonialId: number): void {
    const currentTestimonials = this.testimonialsSubject.value;
    this.testimonialsSubject.next(currentTestimonials.filter(t => t.id !== testimonialId));
    this.saveToLocalStorage();
  }

  // Persistance des données
  private saveToLocalStorage(): void {
    localStorage.setItem('homeHeroSection', JSON.stringify(this.heroSectionSubject.value));
    localStorage.setItem('homeCategories', JSON.stringify(this.categoriesSubject.value));
    localStorage.setItem('homeTestimonials', JSON.stringify(this.testimonialsSubject.value));
  }

  private loadFromLocalStorage(): void {
    const heroSection = localStorage.getItem('homeHeroSection');
    const categories = localStorage.getItem('homeCategories');
    const testimonials = localStorage.getItem('homeTestimonials');

    if (heroSection) {
      this.heroSectionSubject.next(JSON.parse(heroSection));
    }

    if (categories) {
      this.categoriesSubject.next(JSON.parse(categories));
    }

    if (testimonials) {
      this.testimonialsSubject.next(JSON.parse(testimonials));
    }
  }
} 