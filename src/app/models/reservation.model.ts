import { ReservationStatus } from './enums';

export interface Reservation {
  id: number;
  clientId: number;
  providerId: number;
  serviceId: number;
  reservationDate: Date;
  status: ReservationStatus;
}

export const reservations: Reservation[] = [
  {
    id: 1,
    clientId: 1,
    providerId: 1,
    serviceId: 1,
    reservationDate: new Date('2024-04-01T10:00:00Z'),
    status: ReservationStatus.PENDING
  },
  {
    id: 2,
    clientId: 1,
    providerId: 2,
    serviceId: 2,
    reservationDate: new Date('2024-04-02T14:00:00Z'),
    status: ReservationStatus.COMPLETED
  }
];
