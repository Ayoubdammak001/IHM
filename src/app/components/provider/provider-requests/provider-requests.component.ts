import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { Reservation } from '../../../models/reservation.model';
import { ReservationStatus } from '../../../models/enums'; // Assurez-vous que cet import est présent
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-provider-requests',
  standalone: true,
  templateUrl: './provider-requests.component.html',
  styleUrls: ['./provider-requests.component.scss'],
  imports: [CommonModule, NgClass, DatePipe]
})
export class ProviderRequestsComponent implements OnInit {
  requests: Reservation[] = [];
  loading = false;
  error = '';
  ReservationStatus = ReservationStatus; // Ajout pour rendre l'énumération accessible dans le template

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      this.reservationService.getByProviderId(currentUser.id).subscribe({
        next: (requests) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading requests: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  updateStatus(requestId: number, status: ReservationStatus): void {
    this.reservationService.updateStatus(requestId, status).subscribe({
      next: () => {
        this.requests = this.requests.map(request =>
          request.id === requestId ? { ...request, status } : request
        );
      },
      error: (err) => {
        this.error = 'Error updating request: ' + err.message;
      }
    });
  }
}
