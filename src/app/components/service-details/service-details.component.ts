import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ServiceService } from '../../services/service.service';
import { ReviewService } from '../../services/review.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

import { Service } from '../../models/service.model';
import { Review } from '../../models/review.model';
import { ReservationStatus, Role } from '../../models/enums';

@Component({
  selector: 'app-service-details',
  standalone: true,
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
  encapsulation: ViewEncapsulation.None // pour appliquer le style SCSS globalement
})
export class ServiceDetailsComponent implements OnInit {
  service: Service | null = null;
  reviews: Review[] = [];
  loading = false;
  error = '';
  reservationDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private reviewService: ReviewService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const serviceId = Number(this.route.snapshot.paramMap.get('id'));
    if (serviceId) {
      this.loadService(serviceId);
      this.loadReviews(serviceId);
    }
  }

  private loadService(id: number): void {
    this.loading = true;
    this.serviceService.getById(id).subscribe({
      next: (service: Service) => {
        this.service = service;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading service: ' + err.message;
        this.loading = false;
      }
    });
  }

  private loadReviews(serviceId: number): void {
    this.reviewService.getByServiceId(serviceId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  reserveNow(): void {
    this.error = ''; // reset any previous error

    const currentUser = this.authService.currentUserValue;
    const currentUrl = this.router.url;

    if (!currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
      return;
    }

    if (currentUser.role === Role.ADMIN) {
      this.error = 'Only clients and providers can make reservations.';
      return;
    }

    if (!this.reservationDate || !this.service) {
      this.error = 'Please select a valid reservation date.';
      return;
    }

    const dateObj = new Date(this.reservationDate);

    const reservation = {
      clientId: currentUser.id,
      providerId: this.service.providerId,
      serviceId: this.service.id,
      serviceName: this.service.name,
      date: dateObj,
      time: '10:00',
      status: ReservationStatus.PENDING,
      notes: '',
      reservationDate: dateObj
    };

    this.reservationService.add(reservation).subscribe({
      next: () => {
        this.router.navigate(['/client/reservations'], {
          queryParams: { success: 'Reservation added successfully!' }
        });
      },
      error: () => {
        this.error = 'Error while creating reservation. Please try again.';
      }
    });
  }
}
