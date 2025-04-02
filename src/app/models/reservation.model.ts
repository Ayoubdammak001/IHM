import { ReservationStatus } from './enums';

export interface Reservation {
  id: number;
  clientId: number;
  providerId: number;
  serviceId: number;
  reservationDate: Date;
  status: ReservationStatus;
} 