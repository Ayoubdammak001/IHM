import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ReservationService } from '../../../services/reservation.service';
import { ReviewService } from '../../../services/review.service';
import { ServiceService } from '../../../services/service.service';
import { AuthService } from '../../../services/auth.service';

import { Reservation } from '../../../models/reservation.model';
import { Review } from '../../../models/review.model';
import { Service } from '../../../models/service.model';
import { ReservationStatus } from '../../../models/enums';
import {FormsModule} from "@angular/forms";

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule,FormsModule ],
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss']
})
export class ProviderDashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  reviews: Review[] = [];
  services: Service[] = [];

  totalServices = 0;
  totalReservations = 0;
  totalCompleted = 0;
  totalPending = 0;
  totalReviews = 0;

  ReservationStatus = ReservationStatus;
  loading = true;
  error = '';

  reservationChart: any;
  reservationStatsChart: any;
  selectedRange: '7' | '30' | 'all' = '7';

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadDashboardData(currentUser.id);
    }
  }

  private loadDashboardData(providerId: number): void {
    this.loading = true;
    this.error = '';

    this.serviceService.getByProviderId(providerId).subscribe({
      next: (services) => {
        this.services = services;
        this.totalServices = services.length;
      },
      error: () => (this.error = 'Error loading services.')
    });

    this.reviewService.getByProviderId(providerId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.totalReviews = reviews.length;
      },
      error: () => (this.error = 'Error loading reviews.')
    });

    this.reservationService.getByProviderId(providerId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.totalReservations = reservations.length;
        this.totalCompleted = this.getStatusCount('COMPLETED');
        this.totalPending = this.getStatusCount('PENDING');
        this.setupReservationChart();
        this.prepareReservationStatsChart();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading reservations.';
        this.loading = false;
      }
    });
  }

  getStatusCount(status: keyof typeof ReservationStatus): number {
    return this.reservations.filter(r => r.status === ReservationStatus[status]).length;
  }

  setupReservationChart(): void {
    const completed = this.getStatusCount('COMPLETED');
    const pending = this.getStatusCount('PENDING');
    const cancelled = this.getStatusCount('CANCELLED');
    const rejected = this.getStatusCount('REJECTED');
    const data = [completed, pending, cancelled, rejected];
    const total = data.reduce((a, b) => a + b, 0);

    this.reservationChart = {
      labels: ['Completed', 'Pending', 'Cancelled', 'Rejected'],
      datasets: [
        {
          data,
          backgroundColor: ['#198754', '#ffc107', '#6c757d', '#dc3545'],
          datalabels: {
            display: true,
            color: '#fff',
            font: {
              weight: 'bold' as const,
              size: 14
            },
            formatter: (value: number) => {
              const percentage = total ? ((value / total) * 100).toFixed(1) + '%' : '0%';
              return percentage;
            }
          }
        }
      ],
      plugins: {
        datalabels: {
          display: true
        }
      }
    };
  }

  prepareReservationStatsChart(): void {
    const grouped: { [date: string]: number } = {};

    const now = new Date();
    const days = this.selectedRange === 'all' ? Infinity : parseInt(this.selectedRange, 10);
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - days);

    this.reservations.forEach(res => {
      const resDate = new Date(res.reservationDate);
      if (this.selectedRange === 'all' || resDate >= cutoffDate) {
        const dateStr = resDate.toISOString().split('T')[0];
        grouped[dateStr] = (grouped[dateStr] || 0) + 1;
      }
    });

    const sortedDates = Object.keys(grouped).sort();

    this.reservationStatsChart = {
      labels: sortedDates,
      datasets: [
        {
          label: 'Reservations per Day',
          data: sortedDates.map(date => grouped[date]),
          backgroundColor: '#0d6efd',
          borderColor: '#0d6efd',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }

  applyDateFilter(): void {
    this.prepareReservationStatsChart();
  }

  updateReservationStatus(reservationId: number, status: ReservationStatus): void {
    this.reservationService.updateStatus(reservationId, status).subscribe({
      next: () => {
        const index = this.reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
          this.reservations[index].status = status;
          this.totalCompleted = this.getStatusCount('COMPLETED');
          this.totalPending = this.getStatusCount('PENDING');
          this.setupReservationChart();
          this.prepareReservationStatsChart();
        }
      },
      error: () => (this.error = 'Error updating reservation status.')
    });
  }

  protected readonly ChartDataLabels = ChartDataLabels;
}
