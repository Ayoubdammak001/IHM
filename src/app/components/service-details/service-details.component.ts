import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { ReviewService } from '../../services/review.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/service.model';
import { Review } from '../../models/review.model';
import { ReservationStatus, Role } from '../../models/enums';

// 🛠️ Modules Angular nécessaires pour le template
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-details',
  standalone: true, // ✅ active standalone
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  imports: [
    CommonModule,   // ✅ *ngIf, *ngFor, ngClass, date pipe...
    FormsModule,    // ✅ [(ngModel)]
    RouterModule    // ✅ routerLink
  ]
})
export class ServiceDetailsComponent implements OnInit {
  service: Service | null = null;
  reviews: Review[] = [];
  loading = false;
  error = '';
  reservationDate = '';
  isClient = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private reviewService: ReviewService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    this.isClient = this.authService.hasRole(Role.CLIENT);
  }

  ngOnInit(): void {
    const serviceId = Number(this.route.snapshot.paramMap.get('id'));
    if (serviceId) {
      this.loadService(serviceId);
      this.loadReviews(serviceId);
    }
  }

  private loadService(id: number): void {
    this.loading = true;
    this.error = '';
    this.serviceService.getById(id).subscribe({
      next: (service: Service) => {  // Typage explicite pour service
        this.service = service;
        this.loading = false;
      },
      error: (err: any) => {  // Typage explicite pour err
        this.error = 'Error loading service: ' + err.message;
        this.loading = false;
      }
    });
  }

  private loadReviews(serviceId: number): void {
    this.reviewService.getByServiceId(serviceId).subscribe({
      next: (reviews: Review[]) => {  // Typage explicite pour reviews
        this.reviews = reviews;
      },
      error: (error: any) => {  // Typage explicite pour error
        console.error('Error loading reviews:', error);
      }
    });
  }

  makeReservation(): void {
    if (!this.service || !this.reservationDate) return;

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const reservation = {
      clientId: currentUser.id,
      providerId: this.service.providerId,
      serviceId: this.service.id,
      reservationDate: new Date(this.reservationDate),
      status: ReservationStatus.PENDING
    };

    this.reservationService.add(reservation).subscribe({
      next: () => this.router.navigate(['/client/reservations']),
      error: () => this.error = 'Error making reservation. Please try again.'
    });
  }
}
