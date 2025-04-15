import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation } from '../models/reservation.model';
import { ReservationStatus } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getByClientId(clientId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?clientId=${clientId}`);
  }

  getByProviderId(providerId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?providerId=${providerId}`);
  }

  add(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    const newReservation = {
      ...reservation,
      status: ReservationStatus.PENDING
    };
    return this.http.post<Reservation>(this.apiUrl, newReservation);
  }

  updateStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createReservation(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this.add(reservation);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${reservation.id}`, reservation);
  }

  cancelReservation(id: number): Observable<boolean> {
    return this.updateStatus(id, ReservationStatus.CANCELLED).pipe(
      map(() => true)
    );
  }
}
