import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReservationService } from '../../../../services/reservation.service';
import { ServiceService } from '../../../../services/service.service';
import { UserService } from '../../../../services/user.service';
import { Reservation } from '../../../../models/reservation.model'; // ✅ modèle officiel
import { ReservationStatus } from '../../../../models/enums'; // ✅ enum
import { Service } from '../../../../models/service.model';
import { User } from '../../../../models/user.model';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  TableDirective,
  ButtonDirective,
  BadgeComponent
} from '@coreui/angular';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  templateUrl: './client-reservations.component.html',
  styleUrls: ['./client-reservations.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    BadgeComponent
  ]
})
export class ClientReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  currentClientId = 1;
  servicesMap: { [key: number]: Service } = {};
  providersMap: { [key: number]: User } = {};
  loading = false;

  protected readonly ReservationStatus = ReservationStatus;

  constructor(
    private reservationService: ReservationService,
    private serviceService: ServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getByClientId(this.currentClientId)
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
        
        // Get unique service IDs
        const serviceIds = Array.from(new Set(reservations.map(r => r.serviceId)));
        
        // Get unique provider IDs
        const providerIds = Array.from(new Set(reservations.map(r => r.providerId)));
        
        // Fetch services and providers
        if (serviceIds.length > 0) {
          this.serviceService.getManyByIds(serviceIds).subscribe(services => {
            this.servicesMap = services.reduce((acc, service) => {
              acc[service.id] = service;
              return acc;
            }, {} as { [key: number]: Service });
            this.loading = false;
          });
        }
        
        if (providerIds.length > 0) {
          this.userService.getProviders().subscribe(providers => {
            this.providersMap = providers.reduce((acc, provider) => {
              acc[provider.id] = provider;
              return acc;
            }, {} as { [key: number]: User });
            this.loading = false;
          });
        }
      });
  }

  cancelReservation(id: number): void {
    this.reservationService.cancelReservation(id)
      .subscribe(success => {
        if (success) {
          this.loadReservations();
        }
      });
  }

  getBadgeColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.ACCEPTED:
        return 'success';
      case ReservationStatus.PENDING:
        return 'warning';
      case ReservationStatus.CANCELLED:
      case ReservationStatus.REJECTED:
        return 'danger';
      case ReservationStatus.COMPLETED:
        return 'info';
      default:
        return 'secondary';
    }
  }
  
  getServiceName(serviceId: number): string {
    return this.servicesMap[serviceId]?.name ?? `Service #${serviceId}`;
  }
  
  getProviderName(providerId: number): string {
    return this.providersMap[providerId]?.username ?? `Provider #${providerId}`;
  }
}
