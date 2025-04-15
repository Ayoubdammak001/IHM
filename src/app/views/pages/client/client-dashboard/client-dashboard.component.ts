import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Reservation } from '../../../../models/reservation.model';
import { Review } from '../../../../models/review.model';
import { Service } from '../../../../models/service.model';
import { User } from '../../../../models/user.model';
import { ReservationService } from '../../../../services/reservation.service';
import { ReviewService } from '../../../../services/review.service';
import { ServiceService } from '../../../../services/service.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { ClientService } from '../../../../services/client.service';
import { Subscription } from 'rxjs';

interface DashboardData {
  totalSpent: number;
  recommendedServices: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
  }>;
  popularServices: Array<{
    name: string;
    count: number;
  }>;
  monthlyBookings: Array<{
    month: string;
    count: number;
  }>;
  serviceSatisfaction: Array<{
    name: string;
    score: number;
  }>;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ClientDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('popularServicesChart') popularServicesChartRef!: ElementRef;
  @ViewChild('monthlyBookingsChart') monthlyBookingsChartRef!: ElementRef;
  @ViewChild('serviceSatisfactionChart') serviceSatisfactionChartRef!: ElementRef;

  reservations: Reservation[] = [];
  reviews: Review[] = [];
  loading = false;
  error: string | null = null;
  servicesMap: { [key: number]: Service } = {};
  providersMap: { [key: number]: User } = {};
  dashboardData: DashboardData = {
    totalSpent: 0,
    recommendedServices: [],
    popularServices: [],
    monthlyBookings: [],
    serviceSatisfaction: []
  };

  private charts: Chart[] = [];
  private subscription!: Subscription;

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private userService: UserService,
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.loadReservations(currentUser.id);
      this.loadReviews(currentUser.id);
      this.loadDashboardData();
    } else {
      this.loading = false;
      this.error = 'User not logged in';
    }
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is initialized
    setTimeout(() => {
      this.initializeCharts();
    }, 0);
  }

  ngOnDestroy(): void {
    // Clean up charts and subscriptions
    this.charts.forEach(chart => chart.destroy());
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadReservations(clientId: number): void {
    this.reservationService.getByClientId(clientId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;

        const serviceIds = [...new Set(reservations.map(r => r.serviceId))];
        const providerIds = [...new Set(reservations.map(r => r.providerId))];

        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds(serviceIds).subscribe({
            next: (services) => {
              this.servicesMap = services.reduce((acc, service) => {
                acc[service.id] = service;
                return acc;
              }, {} as { [key: number]: Service });
            },
            error: (err) => console.error('Error loading services:', err)
          });
        }

        if (providerIds.length > 0) {
          this.userService.getProviders().subscribe({
            next: (providers) => {
              this.providersMap = providers.reduce((acc, provider) => {
                acc[provider.id] = provider;
                return acc;
              }, {} as { [key: number]: User });
              this.loading = false;
            },
            error: (err) => {
              console.error('Error loading providers:', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error loading reservations.';
        this.loading = false;
      }
    });
  }

  private loadReviews(clientId: number): void {
    this.reviewService.getByClientId(clientId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        const serviceIds = reviews
          .map(r => r.serviceId)
          .filter(id => !this.servicesMap[id]);

        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds([...new Set(serviceIds)]).subscribe({
            next: (services) => {
              for (const service of services) {
                this.servicesMap[service.id] = service;
              }
            },
            error: (err) => console.error('Error loading services for reviews:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }

  getAcceptedReservationsCount(): number {
    return this.reservations.filter(r => r.status === 'ACCEPTED').length;
  }

  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }

  getProviderName(providerId: number): string {
    return this.providersMap[providerId]?.username ?? `Provider #${providerId}`;
  }

  getStarRating(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.subscription = this.clientService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.loading = false;
      }
    });
  }

  private initializeCharts(): void {
    // Initialize Popular Services Chart
    if (this.popularServicesChartRef) {
      const popularServicesCtx = this.popularServicesChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(popularServicesCtx, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              '#36a2eb',
              '#ff6384',
              '#4bc0c0',
              '#ff9f40',
              '#9966ff'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }));
    }

    // Initialize Monthly Bookings Chart
    if (this.monthlyBookingsChartRef) {
      const monthlyBookingsCtx = this.monthlyBookingsChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(monthlyBookingsCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Bookings',
            data: [],
            borderColor: '#36a2eb',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }));
    }

    // Initialize Service Satisfaction Chart
    if (this.serviceSatisfactionChartRef) {
      const satisfactionCtx = this.serviceSatisfactionChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(satisfactionCtx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Satisfaction Score',
            data: [],
            backgroundColor: '#4bc0c0'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }));
    }
  }

  private updateCharts(): void {
    // Update Popular Services Chart
    if (this.charts[0] && this.dashboardData.popularServices) {
      this.charts[0].data.labels = this.dashboardData.popularServices.map(service => service.name);
      this.charts[0].data.datasets[0].data = this.dashboardData.popularServices.map(service => service.count);
      this.charts[0].update();
    }

    // Update Monthly Bookings Chart
    if (this.charts[1] && this.dashboardData.monthlyBookings) {
      this.charts[1].data.labels = this.dashboardData.monthlyBookings.map(booking => booking.month);
      this.charts[1].data.datasets[0].data = this.dashboardData.monthlyBookings.map(booking => booking.count);
      this.charts[1].update();
    }

    // Update Service Satisfaction Chart
    if (this.charts[2] && this.dashboardData.serviceSatisfaction) {
      this.charts[2].data.labels = this.dashboardData.serviceSatisfaction.map(service => service.name);
      this.charts[2].data.datasets[0].data = this.dashboardData.serviceSatisfaction.map(service => service.score);
      this.charts[2].update();
    }
  }
}
