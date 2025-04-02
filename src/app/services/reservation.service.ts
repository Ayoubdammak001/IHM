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
  private apiUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reservations)
    );
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reservations.find((reservation: Reservation) => reservation.id === id))
    );
  }

  getByClientId(clientId: number): Observable<Reservation[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reservations.filter((reservation: Reservation) => reservation.clientId === clientId))
    );
  }

  getByProviderId(providerId: number): Observable<Reservation[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.reservations.filter((reservation: Reservation) => reservation.providerId === providerId))
    );
  }

  add(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const newReservation = {
          ...reservation,
          id: Math.max(...data.reservations.map((r: Reservation) => r.id)) + 1,
          status: ReservationStatus.PENDING
        };
        data.reservations.push(newReservation);
        return newReservation;
      })
    );
  }

  updateStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.reservations.findIndex((r: Reservation) => r.id === id);
        if (index !== -1) {
          data.reservations[index] = { ...data.reservations[index], status };
          return data.reservations[index];
        }
        throw new Error('Reservation not found');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.reservations.findIndex((r: Reservation) => r.id === id);
        if (index !== -1) {
          data.reservations.splice(index, 1);
        }
      })
    );
  }
} 