import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReservationService } from '../../../../services/reservation.service';
import { Reservation } from '../../../../models/reservation.model'; // ✅ modèle officiel
import { ReservationStatus } from '../../../../models/enums'; // ✅ enum

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

  protected readonly ReservationStatus = ReservationStatus;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getByClientId(this.currentClientId)
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
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
}
