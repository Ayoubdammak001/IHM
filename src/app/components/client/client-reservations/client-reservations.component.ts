import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-reservations.component.html',
  styleUrls: ['./client-reservations.component.scss']
})
export class ClientReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  error = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loadReservations(currentUser.id);
    }
  }

  private loadReservations(clientId: number): void {
    this.reservationService.getByClientId(clientId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading reservations. Please try again later.';
        this.loading = false;
      }
    });
  }
}
